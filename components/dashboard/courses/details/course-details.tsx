"use client";

import BackButton from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TCourse } from "@/types/course.types";
import {
  AlertCircle,
  BarChart,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Globe,
  GraduationCap,
  Layers,
  LayoutDashboard,
  PlayCircle,
  Share2,
  Star,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";

const CourseDetailsPage = ({ course }: { course: TCourse }) => {
  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold">Course Not Found</h2>
          <BackButton />
        </div>
      </div>
    );
  }

  const discountPercentage = course.discountPrice
    ? Math.round(((course.price - course.discountPrice) / course.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Courses" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {/* Add Edit/Delete buttons here if needed */}
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Course Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={
                  course.status === "PUBLISHED" ? "default" : "secondary"
                }
                className={course.status === "PUBLISHED" ? "bg-green-600" : ""}
              >
                {course.status}
              </Badge>
              <Badge
                variant="outline"
                className="border-primary/20 text-primary bg-primary/5"
              >
                {course.category?.name}
              </Badge>
              {course.subject && (
                <Badge
                  variant="outline"
                  className="border-blue-500/20 text-blue-600 bg-blue-500/5"
                >
                  {course.subject.name}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {course.title}
            </h1>

            {course.subtitle && (
              <p className="text-xl text-muted-foreground font-medium">
                {course.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-foreground">
                  {course.averageRating || 0}
                </span>
                <span>({course.ratingsCount || 0} ratings)</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.enrolledCount} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{course.language}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  Last updated {new Date(course.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <Card className="border-none shadow-none bg-background">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                About This Course
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div
                className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </CardContent>
          </Card>

          {/* Learnings Section */}
          {course.learnings && course.learnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  What You&apos;ll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learnings.map((learning) => (
                    <div
                      key={learning.id}
                      className="flex gap-3 items-start p-3 rounded-lg bg-muted/30"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 shrink-0" />
                      <div
                        className="text-sm prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: learning.content }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Content / Curriculum */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Course Content
              </CardTitle>
              <CardDescription>
                {course.sections?.length || 0} sections • {course.totalLessons}{" "}
                lessons • {course.totalQuizzes || 0} quizzes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.sections
                ?.sort((a, b) => a.order - b.order)
                .map((section) => (
                  <div
                    key={section.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-muted/50 p-4 flex items-center justify-between font-medium">
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                        {section.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {section.lessons?.length || 0} lessons
                      </span>
                    </div>
                    {section.lessons && section.lessons.length > 0 && (
                      <div className="divide-y border-t">
                        {section.lessons.map((lesson: any, index: number) => (
                          <div
                            key={index}
                            className="p-3 pl-8 text-sm flex items-center gap-3 hover:bg-muted/20 transition-colors"
                          >
                            <PlayCircle className="w-4 h-4 text-primary/70" />
                            <span>Lesson {index + 1}</span>
                            {/* Add lesson title if available in lesson object */}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Requirements Section */}
          {course.requirements && course.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {course.requirements.map((req) => (
                    <li key={req.id} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                      <div
                        className="text-sm prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: req.content }}
                      />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Preview Card */}
            <CardHeader className="p-0">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5 text-yellow-600" />
                Preview
              </CardTitle>
            </CardHeader>
            <Card className="overflow-hidden border-2 shadow-lg">
              <div className="relative aspect-video w-full bg-muted">
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Video className="w-12 h-12" />
                  </div>
                )}
                {course.previewVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer group">
                    <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform" />
                  </div>
                )}
              </div>

              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    {course.discountPrice ? (
                      <>
                        <span className="text-3xl font-bold text-foreground">
                          ${course.discountPrice}
                        </span>
                        <span className="text-lg text-muted-foreground line-through decoration-destructive/50">
                          ${course.price}
                        </span>
                        <Badge variant="destructive" className="ml-auto">
                          {discountPercentage}% OFF
                        </Badge>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-foreground">
                        ${course.price}
                      </span>
                    )}
                  </div>
                  {course.discountPrice && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Limited time offer
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full text-lg h-12 font-semibold"
                    size="lg"
                  >
                    Enroll Now
                  </Button>
                  <Button variant="outline" className="w-full h-11">
                    Add to Wishlist
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <h4 className="font-semibold text-foreground">
                    This course includes:
                  </h4>
                  <div className="grid gap-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-primary" />
                      <span>{course.totalLessons} on-demand video lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>
                        {course.totalQuizzes || 0} quizzes & assignments
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart className="w-4 h-4 text-primary" />
                      <span>Level: {course.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            {course.instructor && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Instructor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {course.instructor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {course.instructor.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {course.instructor.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
