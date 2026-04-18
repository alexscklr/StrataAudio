import { supabase } from '@/api/supabaseClient';

type StorageProvider = 'supabase' | 'r2';

type SignedUploadDescriptor = {
    path: string;
    url: string;
    method?: string;
    headers?: Record<string, string>;
};

type UploadFileParams = {
    bucket: string;
    path: string;
    file: File | Blob;
    upsert?: boolean;
    cacheControl?: string;
    contentType?: string;
};

const resolveStorageProvider = (): StorageProvider => {
    const rawProvider = (import.meta.env.VITE_STORAGE_PROVIDER ?? 'supabase').trim().toLowerCase();
    return rawProvider === 'r2' ? 'r2' : 'supabase';
};

const STORAGE_PROVIDER = resolveStorageProvider();

const toProviderBucket = (bucket: string): string => {
    if (STORAGE_PROVIDER === 'r2' && bucket === 'user_uploads') {
        return 'user-uploads';
    }

    return bucket;
};

const getR2PublicBaseForBucket = (bucket: string): string => {
    const providerBucket = toProviderBucket(bucket);
    const bucketSpecificBase =
        providerBucket === 'videos'
            ? (import.meta.env.VITE_R2_PUBLIC_URL_VIDEOS ?? import.meta.env.VITE_R2_PUBLIC_BASE_URL_VIDEOS)
            : providerBucket === 'system'
                ? (import.meta.env.VITE_R2_PUBLIC_URL_SYSTEM ?? import.meta.env.VITE_R2_PUBLIC_BASE_URL_SYSTEM)
                : providerBucket === 'user-uploads'
                    ? (import.meta.env.VITE_R2_PUBLIC_URL_USER_UPLOADS ?? import.meta.env.VITE_R2_PUBLIC_BASE_URL_USER_UPLOADS)
                    : '';

    if (bucketSpecificBase) {
        return bucketSpecificBase;
    }

    const genericBase = (import.meta.env.VITE_R2_PUBLIC_BASE_URL ?? '').trim();
    if (!genericBase) {
        return '';
    }

    return `${genericBase.replace(/\/$/, '')}/${providerBucket}`;
};

const invokeManageR2Storage = async <T>(body: Record<string, unknown>): Promise<T> => {
    const { data, error } = await supabase.functions.invoke('manage-r2-storage', { body });

    if (error) {
        throw new Error(error.message);
    }

    return data as T;
};

const getFileLikeSize = (file: File | Blob): number | undefined => {
    return typeof file.size === 'number' ? file.size : undefined;
};

const resolveContentType = (file: File | Blob, explicitType?: string): string => {
    if (explicitType?.trim()) {
        return explicitType.trim();
    }

    if ('type' in file && typeof file.type === 'string' && file.type.trim()) {
        return file.type.trim();
    }

    return 'application/octet-stream';
};

const uploadWithSignedDescriptor = async (
    descriptor: SignedUploadDescriptor,
    file: File | Blob,
    contentType?: string
): Promise<void> => {
    const method = descriptor.method ?? 'PUT';
    const headers: Record<string, string> = {
        ...(descriptor.headers ?? {}),
    };
    const hasContentTypeHeader = Object.keys(headers).some((key) => key.toLowerCase() === 'content-type');
    if (contentType && !hasContentTypeHeader) {
        headers['content-type'] = contentType;
    }

    let response: Response;

    try {
        response = await fetch(descriptor.url, {
            method,
            headers,
            body: file,
        });
    } catch (error) {
        throw new Error(
            'Upload fehlgeschlagen. Fuer direkte Browser-Uploads nach R2 muss Bucket-CORS den Origin erlauben (z. B. http://localhost:5173) und PUT zulassen.'
        );
    }

    if (!response.ok) {
        const details = await response.text().catch(() => '');
        throw new Error(
            details
                ? `Upload fehlgeschlagen (${response.status}): ${details}`
                : `Upload fehlgeschlagen (${response.status})`
        );
    }
};

export const getStorageProvider = (): StorageProvider => STORAGE_PROVIDER;

export const getPublicUrl = (
    url: string,
    bucket: string = 'videos'
): string => {
    if (!url) return '';

    if (STORAGE_PROVIDER === 'r2') {
        const base = getR2PublicBaseForBucket(bucket);
        if (!base) {
            return '';
        }

        return `${base.replace(/\/$/, '')}/${url.replace(/^\/+/, '')}`;
    }

    const { data } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(`${url}`);

    return data.publicUrl;
};

export const uploadFileToStorage = async ({
    bucket,
    path,
    file,
    upsert = false,
    cacheControl,
    contentType,
}: UploadFileParams): Promise<void> => {
    const resolvedContentType = resolveContentType(file, contentType);

    if (STORAGE_PROVIDER === 'supabase') {
        const { error } = await supabase.storage.from(bucket).upload(path, file, {
            upsert,
            cacheControl,
            contentType: resolvedContentType,
        });

        if (error) {
            throw new Error(error.message);
        }

        return;
    }

    const response = await invokeManageR2Storage<{ uploads?: SignedUploadDescriptor[] }>({
        action: 'issue_upload_urls',
        bucket: toProviderBucket(bucket),
        files: [
            {
                path,
                mimeType: resolvedContentType,
                sizeBytes: getFileLikeSize(file),
            },
        ],
    });

    const descriptor = response.uploads?.[0];
    if (!descriptor?.url) {
        throw new Error('Signed Upload URL konnte nicht erstellt werden.');
    }

    const shouldForceContentType = STORAGE_PROVIDER !== 'r2';
    await uploadWithSignedDescriptor(descriptor, file, shouldForceContentType ? resolvedContentType : undefined);
};

export const listStoragePathsRecursively = async (bucket: string, prefix: string): Promise<string[]> => {
    if (STORAGE_PROVIDER === 'r2') {
        const response = await invokeManageR2Storage<{ paths?: string[] }>({
            action: 'list_prefix',
            bucket: toProviderBucket(bucket),
            prefix,
        });

        return response.paths ?? [];
    }

    const filePaths: string[] = [];
    const stack: string[] = [prefix];

    while (stack.length > 0) {
        const currentPrefix = stack.pop();
        if (!currentPrefix) {
            continue;
        }

        const { data, error } = await supabase.storage.from(bucket).list(currentPrefix, {
            limit: 1000,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        });

        if (error) {
            throw new Error(error.message);
        }

        for (const entry of data ?? []) {
            const name = (entry as { name?: string }).name;
            if (!name) {
                continue;
            }

            const fullPath = `${currentPrefix}/${name}`;
            const isFolder = (entry as { id?: string | null; metadata?: object | null }).id === null
                || (entry as { metadata?: object | null }).metadata === null;

            if (isFolder) {
                stack.push(fullPath);
            } else {
                filePaths.push(fullPath);
            }
        }
    }

    return filePaths;
};

export const removeStoragePaths = async (bucket: string, paths: string[]): Promise<void> => {
    if (paths.length === 0) {
        return;
    }

    if (STORAGE_PROVIDER === 'r2') {
        await invokeManageR2Storage({
            action: 'delete_paths',
            bucket: toProviderBucket(bucket),
            paths,
        });
        return;
    }

    for (let index = 0; index < paths.length; index += 100) {
        const chunk = paths.slice(index, index + 100);
        const { error } = await supabase.storage.from(bucket).remove(chunk);
        if (error) {
            throw new Error(error.message);
        }
    }
};

export const uploadToSignedStorageUrl = async (
    bucket: string,
    path: string,
    token: string,
    file: File | Blob
): Promise<void> => {
    if (STORAGE_PROVIDER === 'supabase') {
        const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file);
        if (error) {
            throw new Error(error.message);
        }
        return;
    }

    if (!token.startsWith('http://') && !token.startsWith('https://')) {
        const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file);
        if (error) {
            throw new Error(error.message);
        }
        return;
    }

    await uploadWithSignedDescriptor({ path, url: token, method: 'PUT' }, file);
};