import { Link } from 'react-router-dom';
import { TypingAnimation } from '../../components/typing-text/typing-text';
import { useFirstVisit } from '../../hooks/useFirstVisit';

interface SkillItem {
  type: 'heading' | 'skill';
  text: string;
}

export const Skills = () => {
    const isFirstVisit = useFirstVisit('skills');

    const skillItems: SkillItem[] = [
        {
            type: 'heading',
            text: 'Programming Languages'
        },
        {
            type: 'skill',
            text: 'Javascript , Typescript , Dart , Python , C#'
        },
        {
            type: 'heading',
            text: 'Frameworks and Libraries'
        },
        {
            type: 'skill',
            text: 'React'
        },
        {
            type: 'skill',
            text: 'NextJs'
        },
        {
            type: 'skill',
            text: 'Flutter'
        },
        {
            type: 'skill',
            text: 'Djano'
        },
        {
            type: 'skill',
            text: 'NodeJs - ExpressJs'
        },
        {
            type: 'skill',
            text: 'ReactNative'
        },
        {
            type: 'heading',
            text: 'Odoo Developer'
        },
        {
            type: 'skill',
            text: 'Build and customize odoo apps, to meet the business needs.'
        },
        {
            type: 'heading',
            text: 'BaaS (Backend as a Service)'
        },
        {
            type: 'skill',
            text: 'Firebase'
        },
        {
            type: 'skill',
            text: 'Appwrite'
        },
        {
            type: 'heading',
            text: 'Others'
        },
        {
            type: 'skill',
            text: 'Git'
        },
        {
            type: 'skill',
            text: 'Docker'
        },
        {
            type: 'skill',
            text: 'GitHub'
        },
        {
            type: 'skill',
            text: 'Gitlab'
        },
        {
            type: 'skill',
            text: 'Azure DevOps'
        },
    ];

    const allTexts = skillItems.map(item => {
        if (item.type === 'heading') {
            return `\n## ${item.text}\n`;
        } else {
            return `> ${item.text}\n`;
        }
    }).join('');

    return (
        <div>
            <Link to={'/'} className='link'>{'<'} - RETURN TO MENU</Link>
            <div className='text-q ' style={{ fontSize: '1.2rem', whiteSpace: 'pre-wrap' }}>
                <TypingAnimation
                    text={allTexts}
                    duration={1}
                    animate={isFirstVisit}
                    style={{ fontSize: '1.2rem' }}
                />
            </div>
        </div>
    );
};