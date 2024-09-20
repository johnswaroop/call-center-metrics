export interface IProcessSteps {
  Transcription: { active: boolean; complete: boolean };
  Summary: { active: boolean; complete: boolean };
  "Keyword Analysis": { active: boolean; complete: boolean };
  "SOP Processing": { active: boolean; complete: boolean };
}
