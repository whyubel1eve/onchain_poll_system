export interface Application {
  id: number;
  event_id: number;
  applicant_name: string;
  applicant_address: string;
  token_id: number | null;
  status: 'approved' | 'rejected' | 'inProcess';
}
