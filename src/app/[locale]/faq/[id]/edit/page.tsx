import EditFaqPage from "@/components/editFaq/EditFaqPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <EditFaqPage faqId={id} />;
};

export default Page;
