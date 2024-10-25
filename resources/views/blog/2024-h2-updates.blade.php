<x-layout>
	<main class="container">
        <p><a href="<?php echo route('blog'); ?>">&larr; Back to blog</a></p>

        <h1>Update on progress as of the second half of 2024</h1>
        <p><small><b>Published: 2024-10-25</b></small></p>

        <p>It's been a while since the introduction blog post, so I thought it was time for a little update!</p>

        <h2>Quick Overview</h2>

        <h3>✨ New features</h3>

        <p>The following features should all make it in before the end of the year:</p>

        <ul>
            <li>Tags and tag based sorting</li>
            <li>List of completed tasks</li>
            <li>Task search</li>
        </ul>

        <h3>📝 Changes</h3>

        <ul>
            <li>Calendar-based scheduling will not be implemented. Focus on task stacks instead.</li>
            <li>Rewrite using Laravel and Svelte instead of Phoenix and LiveView.</li>
            <li>New layout!</li>
        </ul>

        <h2>How is Afrek coming along?</h2>

        <p>
            The initial implementation has been reworked using Laravel and Svelte instead of Phoenix and LiveView.
            LiveView has limitations in UI interactions that made it difficult to use to make highly responsive UIs, particularly when it came to drag and drop and animations.
            PHP (and thus Laravel) is also easier to deploy on any service, so it'll be easier to find good hosting.
            Looking ahead it'll also be easier for others to self-host if they'd like.
        </p>

        <p>
            The UI has been re-organized to make better use of widescreen computers and laptops.
            The UI for the task list is now a 2 column layout that fills up the screen.
            The aim is to emphasize that the task description itself is all in the details instead of just the title.
            Afrek is also for taking notes, not just a todo list.
        </p>

        <p>
            I don't think this can be made responsive, so I'll eventually have to make a mobile-only UI.
            That's probably best represented through an app instead of trying to make the website responsive, but I haven't made a decision on this quite yet.
        </p>

        <p>
            Rich text editing in the task details will be implemented.
            Currently task details are just free-form text.
            I haven't quite decided how detailed I want to go here, but I do know I'd like to at the very least support all the basic HTML elements.
            Beyond that, there will ideally some smart blocks, such as interactive checklists, WYSIWYG code blocks, and the like.
        </p>

        <p>
            And finally, I've pivoted away from calendar-based scheduling to a more free-form approach based around task "stacks".
            In essence: group tasks into stacks, focus on one stack at a time, with an optional timer if you'd like.
            This is both simpler to implement, and lines up better with how I work.
            I'm not fully convinced scheduling is useless though, so it might make it back in at some point, but it's not a short-term goal.
        </p>

        <p>
            The goal for a paid beta is anytime before the second half of 2025.
            I'm quite busy so development is slow, but I try to put in some work as often as I can.
        </p>

        <p>
            Overall, the goal is much the same: keep things as simple as possible, while still retaining all the features I want.
        </p>

        <p>Until next time! 👋</p>
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
