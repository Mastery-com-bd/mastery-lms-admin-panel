import CourseDetailsPage from '@/components/dashboard/courses/details/course-details';
import { getCourseDetailsById } from '@/service/course';
import React from 'react'

const Page = async ({params}: {params: Promise<{id: string}>}) => {
  const {id} = await params;

  const courseDetails = await getCourseDetailsById(id);

  console.log("Sections :", courseDetails.data)


  return (
    <div>
        <CourseDetailsPage course={courseDetails.data} />
    </div>
  )
}

export default Page