import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TSubject } from "@/types/subject.types";
import { BookOpen, Calendar } from "lucide-react";
import Image from "next/image";

const SubjectDetails = ({ subject }: { subject: TSubject }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* ===== Header Section ===== */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Icon */}
          {subject.iconUrl && (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border">
              <Image
                src={subject?.iconUrl}
                alt={subject?.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex-1">
            <CardTitle className="text-3xl font-bold">
              {subject?.name}
            </CardTitle>

            <CardDescription className="mt-2 flex flex-wrap gap-4 items-center">
              <Badge variant={subject?.isActive ? "default" : "secondary"}>
                {subject?.isActive ? "Active" : "Inactive"}
              </Badge>

              <span className="flex items-center gap-1 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(subject?.createdAt).toLocaleDateString()}
              </span>
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* ===== Description Section ===== */}
      <Card>
        <CardHeader>
          <CardTitle>About This Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {subject?.description}
          </p>
        </CardContent>
      </Card>

      {/* ===== Courses Section ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Courses Under This Subject
          </CardTitle>
        </CardHeader>

        <CardContent>
          {subject?.courses && subject?.courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subject?.courses.map((course) => (
                <Card key={course?.id} className="hover:shadow-lg transition">
                  <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                    {course?.thumbnail ? (
                      <Image
                        src={course?.thumbnail}
                        alt={course?.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-2">
                      {course?.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              No courses available for this subject.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectDetails;
