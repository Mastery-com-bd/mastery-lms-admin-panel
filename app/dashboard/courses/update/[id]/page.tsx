import UpdateCourse from "@/components/dashboard/courses/update/update-course"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <UpdateCourse courseId={id} />
}
