import { supabase } from '@/api/supabaseClient';
import { mapDemographicsToPayload, type DemographicsFormValues } from '../utils/demographicsSurvey';

interface SaveDemographicsInput {
    participantId: string;
    values: DemographicsFormValues;
}

export const saveDemographics = async ({
    participantId,
    values,
}: SaveDemographicsInput): Promise<void> => {
    const payload = mapDemographicsToPayload(participantId, values);

    const { error } = await supabase
        .from('demographics')
        .insert(payload);

    if (error) {
        if (error.code === '23505') {
            return;
        }

        throw error;
    }
};