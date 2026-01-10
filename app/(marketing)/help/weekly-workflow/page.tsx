import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { Prose } from "@/components/ui/prose";
import { cn } from "@/lib/utils";
import { Calendar, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Weekly Workflow Guide - Afrek",
  description:
    "Learn how to use weekly planning to stay organized and get more done.",
};

export default function WeeklyWorkflowPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/help"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-8 -ml-2"
        )}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Help
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <Calendar className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">
          Weekly Workflow Guide
        </h1>
      </div>

      {/* Why weekly-first */}
      <div className="mb-12 rounded-lg border bg-muted/30 p-6">
        <h2 className="mb-4 text-lg font-semibold">Why weekly-first?</h2>
        <p className="text-muted-foreground">
          Days are too granular—you can&apos;t predict everything. &quot;Someday&quot; is
          too vague—nothing ever gets done. <strong>Weeks are the sweet spot.</strong>{" "}
          They&apos;re long enough to accomplish meaningful work, short enough
          to stay accountable.
        </p>
      </div>

      <Prose>
        <h2>The recommended weekly routine</h2>

        <h3>End of week (or Sunday)</h3>
        <p>Take 10-15 minutes to:</p>
        <ul>
          <li>
            <strong>Review your completed tasks</strong> — What did you actually
            accomplish? Celebrate your wins, even small ones.
          </li>
          <li>
            <strong>Move incomplete tasks</strong> — Anything left over from
            this week? Either reschedule it or move it back to backlog if
            it&apos;s not urgent.
          </li>
          <li>
            <strong>Re-prioritize your backlog</strong> — Has anything become
            more or less important?
          </li>
        </ul>

        <h3>Monday planning</h3>
        <p>Start your week with intention:</p>
        <ul>
          <li>
            <strong>Brain dump</strong> — Add any new tasks that are on your
            mind to the backlog.
          </li>
          <li>
            <strong>Plan realistically</strong> — Look at your week ahead. How
            many hours do you actually have? Don&apos;t overcommit.
          </li>
          <li>
            <strong>Schedule your week</strong> — Drag tasks from backlog into
            specific days. Spread them out—don&apos;t front-load Monday.
          </li>
        </ul>

        <h3>Daily check-in</h3>
        <p>Each morning, spend 2-3 minutes:</p>
        <ul>
          <li>
            <strong>Review today&apos;s tasks</strong> — What&apos;s on deck?
          </li>
          <li>
            <strong>Adjust if needed</strong> — Move tasks between days if your
            schedule changed.
          </li>
          <li>
            <strong>Pick your focus</strong> — What&apos;s the most important
            task today?
          </li>
        </ul>

        <h2>Using Afrek features in this workflow</h2>

        <h3>Backlog for capture</h3>
        <p>
          Your backlog is your &quot;inbox&quot; for tasks. Anything you need to do
          but haven&apos;t committed to a specific day lives here. Don&apos;t
          let it grow indefinitely—regularly review and either schedule or
          delete tasks.
        </p>

        <h3>Weekly view for scheduling</h3>
        <p>
          This is your command center. You see Monday through Sunday at a
          glance. Drag tasks from backlog or use the quick action buttons
          (Today, Tomorrow, This Week) to schedule them.
        </p>

        <h3>Tags for organization</h3>
        <p>
          Use tags to categorize by project, client, or context. Examples:
          &quot;work&quot;, &quot;personal&quot;, &quot;client-acme&quot;, &quot;calls&quot;. Then filter your view
          to focus on one area at a time.
        </p>

        <h3>Notes for context</h3>
        <p>
          Expand any task to add notes in markdown. Use this for meeting prep,
          links, code snippets, or anything else that helps you complete the
          task.
        </p>

        <h3>Completed view for reflection</h3>
        <p>
          Don&apos;t skip this! Looking back at what you accomplished builds
          momentum and helps you plan more accurately in the future.
        </p>

        <h2>Example week</h2>

        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Focus</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monday</td>
              <td>Weekly planning, 2-3 medium tasks</td>
            </tr>
            <tr>
              <td>Tuesday</td>
              <td>Deep work day, 1 large task</td>
            </tr>
            <tr>
              <td>Wednesday</td>
              <td>Meetings + small tasks</td>
            </tr>
            <tr>
              <td>Thursday</td>
              <td>Deep work day, 1 large task</td>
            </tr>
            <tr>
              <td>Friday</td>
              <td>Wrap up, review, plan next week</td>
            </tr>
          </tbody>
        </table>

        <h2>Tips for success</h2>

        <ul>
          <li>
            <strong>Be realistic</strong> — Most people overestimate what they
            can do in a day and underestimate what they can do in a week. Start
            with fewer tasks than you think you can handle.
          </li>
          <li>
            <strong>Leave buffer</strong> — Don&apos;t schedule every hour.
            Things come up. Leave room for the unexpected.
          </li>
          <li>
            <strong>Use your backlog</strong> — It&apos;s okay for things to wait.
            Not everything is urgent.
          </li>
          <li>
            <strong>Review consistently</strong> — The end-of-week review is
            where the magic happens. It&apos;s how you learn to plan better over
            time.
          </li>
        </ul>
      </Prose>

      <div className="mt-12 text-center">
        <Link href="/sign-up" className={cn(buttonVariants({ size: "lg" }))}>
          Start planning your week
        </Link>
      </div>
    </div>
  );
}
