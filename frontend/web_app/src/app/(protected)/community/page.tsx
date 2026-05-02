import { redirect } from "next/navigation";
import { placeholderCopies } from "../../../navigation/placeholderCopies";
import { AppPlaceholderPage } from "../../../views/app/AppPlaceholderPage";

const copy = placeholderCopies["/community"];

export default function Page() {
  if (!copy) {
    redirect("/dashboard");
  }

  return <AppPlaceholderPage copy={copy} />;
}
