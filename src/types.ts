export interface EmployeeInfo {
  氏名: string;
  スキル: string;
  最寄駅: string;
  希望勤務形態: string;
  備考: string;
}

export interface MatchingResult {
  要員ID: string;
  受信日時: string;
  要員情報: EmployeeInfo;
  "案件とのマッチ度（100点満点）": number | string;
  理由コメント: string;
}

export interface MatchingResponse {
  candidates: MatchingResult[];
  推奨アクション: string[];
}

export interface FormData {
  案件名: string;
  必須スキル: string;
  単価: string;
  勤務地および勤務形態: string;
}

