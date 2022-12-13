import { ParamListBase } from "@react-navigation/native";

export type StackParamList = {
  Home: undefined;
  Select: { provider: string };
  Import: { provider: string };
};

// https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
declare global {
  // eslint-disable-next-line  @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends StackParamList {}
  }
}
