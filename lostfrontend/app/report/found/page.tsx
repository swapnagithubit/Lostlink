import { ItemForm } from "@/components/item-form"

export const metadata = {
  title: "Report Found Item - FindMyThing",
  description: "Found something on campus? Report it here to help reunite it with its owner.",
}

export default function ReportFoundPage() {
  return <ItemForm type="found" />
}
