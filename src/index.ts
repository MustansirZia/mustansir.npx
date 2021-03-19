#! /usr/bin/env node

import { Octokit } from '@octokit/rest';
import chalk from 'chalk';
import terminalLink from 'terminal-link';
import { emoji, emojify } from 'node-emoji';
import config from './config.json';

const log = console.log;

const title = (title: string): string => chalk.yellowBright(`=> ${title}`);

const body = chalk.greenBright;

const octokit = new Octokit();

const go = async (): Promise<void> => {
    try {
        const { data: user } = await octokit.users.getByUsername({
            username: config.githubUsername,
        });
        const { data: repos } = await octokit.search.repos({
            q: `user:${config.githubUsername}`,
        });

        log(title(`${config.name} ${emoji.person_with_blond_hair}`));

        log('\n');

        log(title('Who Am I?'));

        log(body(config.bio));

        log('\n');

        log(title("Things That I've Built"));

        const getRepoBody = (repo: typeof repos.items[0], index: number): string =>
            `${index + 1}) ${terminalLink(repo.name, repo.html_url)}\n${emojify(repo.description)}\nStars: ${
                repo.stargazers_count
            } ${emoji.star}`;

        log(
            body(
                repos.items
                    .slice(0, config.topRepos)
                    .map(getRepoBody)
                    .join('\n\n'),
            ),
        );

        log('\n');

        log(title(terminalLink(`Visit my Github Profile! ${emoji.airplane}`, user.html_url)));

        log(title(terminalLink(`Visit my Blog! ${emoji.airplane}`, config.blog)));

        log(
            title(
                terminalLink(`Follow Me on Twitter! ${emoji.airplane}`, `https://twitter.com/${config.twitterHandle}`),
            ),
        );

        log('\n');

        log(title(`Have a great day! ${emoji.heart}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

go();
