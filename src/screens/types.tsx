type Expense = {
  id: string;
  title: string;
  amount: number;
  date: string;
};

type RootParamList = {
  Welcome: undefined;
  Home: undefined;
  Profile: undefined;
};

export type { Expense, RootParamList };
