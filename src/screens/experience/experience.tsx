import { TypingAnimation } from '../../components/typing-text/typing-text';
import { useFirstVisit } from '../../hooks/useFirstVisit';

interface SkillItem {
  type: 'heading' | 'skill' | 'description';
  text: string;
}

export const Experience = () => {
    const isFirstVisit = useFirstVisit('skills');

    const skillItems: SkillItem[] = [
        {
            type: 'heading',
            text: 'Experience'
        },
        {
            type: 'description',
            text: '- Software Developer - From 2024/2 to Present.'
        },
        {
            type: 'description',
            text: ' > Software Developer at Sofa '
        },
    ];

    const allTexts = skillItems.map(item => {
        if (item.type === 'heading') {
            return `\n## ${item.text}\n`;
        } else {
            return ` ${item.text}\n`;
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
