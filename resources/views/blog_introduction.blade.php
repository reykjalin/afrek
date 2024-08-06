<x-layout>
	<main class="container">
        <p><a href="<?php echo route('blog'); ?>">&larr; Back to blog</a></p>

        <h1>Introducing Afrek.app</h1>
        <p><small><b>Last updated: 2024-02-01</b></small></p>

        <h2>Table of Contents</h2>

        <ol>
            <li><a href="#motivations">Motivation</a></li>
            <li><a href="#schedule">Schedule</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li>
                <a href="#phases">Phases</a>
                <ol>
                    <li><a href="#alpha">Alpha</a></li>
                    <li><a href="#beta">Beta</a></li>
                    <li><a href="#production">Production</a></li>
                    <li><a href="#post-production">Post-production</a></li>
                    <li><a href="#dreams">Further dream features</a></li>
                </ol>
            </li>
        </ol>

        <h2 id="motivations">Motivations</h2>

        <ul>
            <li>
                I'm frustrated with the selection of available day planners, they're either too complex, e.g. full project management apps, or too simple, e.g. enhanced todo lists.
            </li>
            <li>
                I've tried promising candidates but they either do too much for my liking or are too expensive at US$15+ per month.
            </li>
        </ul>

        <p>
            I will be charging a subscription fee for Afrek, but the goal is not to make money off the service, but rather to cover the hosting costs and to support the time I plan on putting into Afrek over the next several years.
        </p>

        <h2 id="schedule">Schedule</h2>

        <p>
            Development will be split into roughly 3 phases:
        </p>
        <ul>
            <li>Alpha: wrapped up in the first half of 2024.</li>
            <li>Beta: wrapped up by the end of 2024.</li>
            <li>Full production release: wrapped up in the first half of 2025.</li>
            <li>Post-production tasks: indefinite; will happen after the full production release.</li>
        </ul>

        <p>
            If you found Afrek naturally feel free to sign up and give it a spin!
            There will be no obligation for you to keep using Afrek if you don't like it once I start charging for it.
            I will start officially asking for testers during the start of the beta phase, both to look for bugs, get feature requests, and to try to find like-minded people that want the same type of day planner that I want.
        </p>

        <p>
            The code to Afrek will be open-sourced no later than the early production stage, in case you'd like to run your own instance instead of paying for the one I'm running.
        </p>

        <h2 id="pricing">Pricing</h2>

        <p>
            I will start charging subscription fees for the app sometime during the beta stage.
            The production level pricing will be US$3 per month, US$30 per year, and includes a free 30-day trial.
        </p>

        <p>
            I have not yet decided if I will start charging at reduced pricing during the beta stage or if I will jump immediately to the full price.
            I suppose it depends on the features available at that time, as well as the overall quality of the user experience.
            Rest assured pricing will not be enabled without notice, if you've signed up you'll receive an email at least 30 days before you must buy a subscription, and that subscription will still come with a 30-day free trial, so you'll get at least an additional 2 months free before you have to actually start paying.
        </p>

        <p>
            I know that not everyone can afford to pay for subscriptions, so I plan to offer free use of, and reduced pricing for, Afrek to students as well as people living in weaker economies around the world.
            This will be offered and considered on a case-by-case basis to begin with.
            You can apply by sending an email to the contact link in the footer.
            In the future, once I've identified any trends in the types of people that are applying for free use or reduced pricing, I may add some form of automated process for applying for or getting reduced pricing in addition to the manual approach.
            At this time I simply don't have enough knowledge to understand how to apply this automatically.
        </p>

        <h2 id="phases">Phases</h2>

        <h3 id="alpha">Alpha</h3>

        <ul>
            <li>
                Functional todo lists with rich-text notes.
                <ul>
                    <li>This means being able to create, complete, archive, and edit tasks.</li>
                </ul>
            </li>
            <li>
                Naive scheduling capabilities for planning your day.
                <ul>
                    <li>No auto-scheduling when tasks are moved or changed.</li>
                    <li>No "protection" from overlapping tasks in the schedule.</li>
                </ul>
            </li>
            <li>
                Basic task completion tracking, sorted by dates and most recently completed.
            </li>
        </ul>

        <h3 id="beta">Beta</h3>

        <ul>
            <li>
                When the duration of a task changes reorganize the later tasks. You should only be able to have one task scheduled at any given time by design.
            </li>
            <li>
                Add support for tags and filtering by tags to support the idea of multiple lists.
            </li>
            <li>
                Calendar integrations for GMail, Outlook, and CalDAV.
                <ul>
                    <li>
                        This may or may not be shifted to production, or even post-production, depending on how much effort it will require to support these calendar integrations.
                    </li>
                </ul>
            </li>
        </ul>

        <h3 id="production">Production</h3>

        <ul>
            <li>
                User experience enhancements.
            </li>
            <li>
                Configuration options, e.g. adjusting the interval in the schedule at which tasks can be scheduled via drag-and-drop.
            </li>
            <li>
                Day planning wizard to help you create new tasks and schedule your existing tasks at the start of your day, including tracking the time it takes to plan your day.
            </li>
            <li>
                Natural language processing for creating tasks and scheduling them instead of multiple input boxes that must be filled out individually.
                Think something along the lines of creating tasks with a sentence along the lines of "Foo the bar at 3pm tomorrow for 1.5 hours".
            </li>
        </ul>

        <h3 id="post-production">Post-production</h3>

        <ul>
            <li>
                Documentation on what I think the best way to use Afrek is, e.g. techniques for planning your day and how Afrek helps with that.
            </li>
        </ul>

        <h3 id="dreams">Further dream features</h3>

        <p>
            I would love to be able to add some further features to Afrek, but whether I get to them depends on multiple factors, most importantly the financial success of Afrek.
            I have a full-time job and a family, so I'm working on Afrek in spare time I can find here and there over the span of weeks.
            If Afrek ever becomes successful enough to significantly support or replace the income from my full-time job I will be reducing my hours at work, but to get to even the start of that point would require at least 5,000 monthly subscribers.
        </p>

        <p>
            My current goals for Afrek aren't nearly that lofty.
            I'd be happy to just have 10s of subscribers that love Afrek and how it works.
            If I reach that point I will have considered this a major success.
            But if I ever do reach the point where I can put more effort into Afrek here are some of the dreams I'd love to see implemented:
        </p>

        <ul>
            <li>Native mobile apps on all major platforms.</li>
        </ul>

    </main>

    <style>
        :root {
            --pico-font-size: 18px;
        }

        main.container {
            max-width: 760px;
            margin: auto;
        }
    </style>
</x-layout>
