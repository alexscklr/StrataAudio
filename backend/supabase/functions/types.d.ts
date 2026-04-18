declare module 'npm:@aws-sdk/client-s3@3.908.0' {
  export class S3Client {
    constructor(config?: unknown);
    send(command: unknown): Promise<any>;
  }

  export class PutObjectCommand {
    constructor(input?: unknown);
  }

  export class ListObjectsV2Command {
    constructor(input?: unknown);
  }

  export class DeleteObjectsCommand {
    constructor(input?: unknown);
  }
}

declare module 'npm:@aws-sdk/s3-request-presigner@3.908.0' {
  export function getSignedUrl(
    client: unknown,
    command: unknown,
    options?: unknown,
  ): Promise<string>;
}