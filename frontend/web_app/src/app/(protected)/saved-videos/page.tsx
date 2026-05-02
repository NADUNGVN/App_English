import { redirect } from "next/navigation";
import { placeholderCopies } from "../../../navigation/placeholderCopies";
import { AppPlaceholderPage } from "../../../views/app/AppPlaceholderPage";

const copy = placeholderCopies["/saved-videos"];

export default function Page() {
  if (!copy) {
    redirect("/dashboard");
  }

  return <AppPlaceholderPage copy={copy} />;
}
