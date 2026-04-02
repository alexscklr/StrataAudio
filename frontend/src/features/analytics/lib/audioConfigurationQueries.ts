import { supabase } from '@/api/supabaseClient';
import type { AudioConfigurationSnapshot } from '@/shared/types/mixer';

interface SaveAudioConfigurationInput {
  participantId: string;
  videoId: string;
  snapshot: AudioConfigurationSnapshot;
}

export const saveAudioConfiguration = async ({
  participantId,
  videoId,
  snapshot,
}: SaveAudioConfigurationInput): Promise<string> => {
  const configurationId = crypto.randomUUID();

  const { error } = await supabase
    .from('audio_configurations')
    .insert({
      id: configurationId,
      participant_id: participantId,
      video_id: videoId,
      final_settings: snapshot.final_settings,
      interaction_log: snapshot.interaction_log,
      total_interactions: snapshot.total_interactions,
      time_to_mix_ms: snapshot.time_to_mix_ms,
    });

  if (error) {
    throw error;
  }

  return configurationId;
};
