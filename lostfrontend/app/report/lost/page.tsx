import { ItemForm } from "@/components/item-form"

export const metadata = {
  title: "Report Lost Item - LostLink",
  description: "Report your lost item and let the campus community help you find it.",
}

export default function ReportLostPage() {
  return <ItemForm type="lost" />
}
