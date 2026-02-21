import { render } from "@testing-library/react-native";
import HomeScreen from "..";

describe("<HomeScreen />", () => {
  test("Title text renders correctly on HomeScreen", () => {
    const { getByText } = render(<HomeScreen />);
    getByText("Bank Holidays");
  });
});
