<x-layout>
	<main class="container-fluid">
        <section>
            <article class="warning">
                <header>
                    <a href="<?php echo( route( 'blog.2024-h2-updates' ) ); ?>">Afrek is still a work in progress</a>
                </header>

                <p>
                    Task management has mostly been implemented, but key features such as task scheduling are still missing.
                    You are still more than welcome to sign up!
                    Once ready Afrek will cost US$3 per month or US$30 per year.
                    Emails will be sent to everyone registered with at least 30-day notice before the first payment is due.
                </p>
            </article>
        </section>

        <section>
            <div class="grid call-to-action">
                <div>
                    <h1>Be productive with Afrek</h1>
                    <p>Plan. Stay organized. Succeed.</p>

                    <button>Sign up</button>
                    <p><small>It's free for now!</small></p>
                    <p><small><a href="<?php echo( route( 'blog.introduction' ) ); ?>">Eventually</a> this will be a 30-day free trial and then US$3/month or US$30/year.</small></p>
                </div>
                <div>
                    <figure>
                        <img src="/screenshots/dark-mode-task-list.webp" alt="Screenshot missing" />
                    </figure>
                </div>
            </div>
        </section>

        <section class="overview grid">
            <div class="column center">
                <!-- Heroicons -- calendar-days -->
                <svg width="100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                </svg>
                <h3>Plan your day</h3>
                <p>Afrek comes with excellent tools to help you plan your work day in a way that enables maximum productivity.</p>
            </div>

            <div class="column center">
                <!-- Heroicons -- bookmark-square -->
                <svg width="100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
                </svg>
                <h3>Keep an accurate history of your tasks</h3>
                <p>With Afrek you can keep track of when you complete your tasks so you have a perfect view of the work you've finished to this day.</p>
            </div>

            <div class="column center">
                <!-- Heroicons -- clock -->
                <svg width="100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <h3>Time boxing at it's finest</h3>
                <p>Afrek is built to help you time box your tasks in a way that's forgiving &mdash; we all suck at estimating after all.</p>
            </div>
        </section>

        <section id="features">
            <div class="grid">
                <article>
                    <header>
                        <h3>Tasks are more than just short descriptions</h3>
                    </header>

                    <p>(Still a work in progress)</p>
                    <p>
                        Afrek has full rich-text editing capabilities allowing you to include all the details necessary to complete your task.
                        Take beautiful and functional notes that make it easier to complete your task when it's time to get to work!
                    </p>
                </article>

                <figure>
                    <img src="" height="300" width="300" alt="Screenshot missing" />
                </figure>
            </div>

            <div class="grid">
                <article>
                    <header>
                        <h3>Organization that gets out of your way</h3>
                    </header>

                    <p>(Still a work in progress)</p>
                    <p>
                        Create task stacks to organize your tasks into manageable chunks.
                        Stacks help you get through the day by explicitly creating little breaks throughout the day for you to enjoy.
                    </p>
                </article>

                <figure>
                    <img src="" alt="Screenshot missing" />
                </figure>
            </div>

            <div class="grid">
                <article>
                    <header>
                        <h3>Keep a complete history of what you've accomplished</h3>
                    </header>

                    <p>(Still a work in progress)</p>
                    <p>
                        Never again will you have to wonder what you worked on.
                        Just look at the list of completed tasks, neatly sorted based on completion date.
                        To make sure you always find what you need you can filter and search through the tasks based on tag or text.
                    </p>
                </article>

                <figure>
                    <img src="" height="300" width="300" alt="Screenshot missing" />
                </figure>
            </div>
        </section>
	</main>

    <style>
        :root {
            --pico-font-size: 18px;
        }

        main > section:not(:first-child) {
            margin-block: 10rem;
        }

        article {
            background-color: var(--pico-color-indigo-100);

            & > header {
                background-color: var(--pico-color-indigo-200);

                & > * {
                    margin: 0;
                }
            }

            &.warning {
                background-color: var(--pico-color-orange-100);

                & > header {
                    background-color: var(--pico-color-orange-200);
                }
            }
        }

        section.overview.grid {
            gap: 5rem;
        }

        #features > div:nth-child(even) > article {
            @media(min-width: 768px) {
                order: 1;
            }
        }

        .column {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
        }

        .center {
            text-align: center;
        }

        .call-to-action {
            padding-inline: var(--pico-spacing-horizontal);
            @media(min-width: 768px) {
                padding-inline: 5rem;
            }
            align-items: center;
            gap: 5rem;

            & button {
                width: 100%;
            }

            & p:has(small) {
                text-align: center;
            }

            & figure {
                border: 3px solid var(--pico-color-violet-400);
                border-radius: 10px;

                & img {
                    border-radius: 10px;
                }
            }
        }

        @media(prefers-color-scheme: dark) {
            article {
                background-color: var(--pico-color-indigo-700);

                & > header {
                    background-color: var(--pico-color-indigo-800);
                }

                &.warning {
                    background-color: var(--pico-color-orange-600);

                    & > header {
                        background-color: var(--pico-color-orange-700);
                    }
                }
            }
        }
    </style>
</x-layout>
