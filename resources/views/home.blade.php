<x-layout>
	<main class="container-fluid">
        <section>
            <article class="warning">
                <header>
                    <a href="/blog/introduction">Afrek is still a work in progress</a>
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
            <article>
                <header>
                    <h2>Be productive with Afrek</h2>
                </header>

                <div class="grid">
                    <div>
                        <p>Plan. Stay organized. Succeed</p>
                        <button>Sign up</button>
                        <p><small>It's free for now!</small></p>
                        <p><small><a href="/blog/introduction">Eventually</a> this will be a 30-day free trial and then US$3/month or US$30/year.</small></p>
                    </div>
                    <figure>
                        <img src="" alt="Screenshot missing" />
                    </figure>
                </div>
            </article>
        </section>

        <section class="grid">
            <div>
                <p>Icon</p>
                <h3>Plan your day</h3>
                <p>Afrek comes with excellent tools to help you plan your work day in a way that enables maximum productivity.</p>
            </div>

            <div>
                <p>Icon</p>
                <h3>Keep an accurate history of your tasks</h3>
                <p>With Afrek you can keep track of when you complete your tasks so you have a perfect view of the work you've finished to this day.</p>
            </div>

            <div>
                <p>Icon</p>
                <h3>Time boxing at it's finest</h3>
                <p>Afrek is built to help you time box your tasks in a way that's forgiving &mdash; we all suck at estimating after all.</p>
            </div>
        </section>

        <section>
            <div class="grid">
                <article>
                    <header>
                        <h3>Tasks are more than just short descriptions</h3>
                    </header>

                    <p>Afrek has full rich-text editing capabilities allowing you to include all the details necessary to complete your task.</p>
                </article>

                <figure>
                    <img src="" alt="Screenshot missing" />
                </figure>
            </div>

            <div class="grid">
                <figure>
                    <img src="" alt="Screenshot missing" />
                </figure>

                <article>
                    <header>
                        <h3>Scheduling that gets out of your way</h3>
                    </header>

                    <p>(Still a work in progress)</p>
                    <p>
                        Scheduling your tasks is just a matter of dragging and dropping tasks on a calendar-like interface.
                        Afrek will automatically shift tasks around to prevent any tasks from overlapping.
                    </p>
                </article>
            </div>
        </section>
	</main>

    <style>
        :root {
            --pico-font-size: 18px;
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
