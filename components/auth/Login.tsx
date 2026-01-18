/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@/provider/AuthContext";
import { login } from "@/service/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { refetchUser, setIsLoading } = useUser();

  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const toastId = toast.loading("Logging in...");
    try {
      const res = await login(values);
      if (res?.success) {
        toast.success(res?.message, { id: toastId, duration: 3000 });
        setIsLoading(false);
        await refetchUser();
        form.reset();
        router.push("/");
      }
    } catch (error: any) {
      const errorInfo =
        error?.error ||
        error?.data?.errors[0]?.message ||
        error?.data?.message ||
        "Something went wrong!";
      toast.error(errorInfo, { id: toastId, duration: 3000 });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} {...field} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>

        <Button
          className="w-full cursor-pointer mt-2"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign In
        </Button>
      </form>
    </Form>
  );
};

export default Login;
