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
            text: 'React: Proficient in React.js concepts and ecosystem, including TanStack Query, Zustand, PrimeReact, Material UI, React Hook Form, React Router, and more.'
        },
        {
            type: 'skill',
            text: 'Flutter: Built multiple projects and worked with maps, notifications, state management (GetX), sqflite, Firebase and more.'
        },
        {
            type: 'skill',
            text: 'React Native: Worked with react native and expo ecosystem.'
        },
        {
            type: 'skill',
            text: 'OWL (Odoo Framework): Worked with odoo framework.'
        },
        {
            type: 'heading',
            text: 'Odoo Developer'
        },
        {
            type: 'skill',
            text: 'Build and customize odoo apps, to meet the business needs'
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
            text: 'Azure DevOps'
        },
    ];

    // Combine all texts into a single string with formatting
    const allTexts = skillItems.map(item => {
        if (item.type === 'heading') {
            // Add extra newline before headings (except the first one)
            return `\n## ${item.text}\n`;
        } else {
            return `> ${item.text}\n`;
        }
    }).join('');


    return (
        <div className='flex flex-col gap-4'>
            {/* Render single TypingAnimation with combined text */}
            <div className='text-q text-q-content' style={{ fontSize: '1.2rem', whiteSpace: 'pre-wrap' }}>
                <TypingAnimation
                    text={allTexts}
                    duration={5} // Adjust duration as needed for the combined text
                    animate={isFirstVisit}
                    style={{ fontSize: '1.2rem' }}
                />
            </div>
        </div>
    );
};