import { useState, useEffect } from 'react'
import { TypingAnimation } from '../../components/typing-text/typing-text'

export const LearningTraining = () => {
    const [showEducation, setShowEducation] = useState<boolean>(false);
    const [currentEducation, setCurrentEducation] = useState<number>(-1);
    const [showTraining, setShowTraining] = useState<boolean>(false);
    const [currentTraining, setCurrentTraining] = useState<number>(-1);
    
    const education = [
        `Emirates International University, Sana'a
  Bachelor's Degree in Information Technology
  2019 – 2023`,
        `General Telecommunication Institue, Sana'a
  Cisco Academy: Cisco Certified Network Associate (CCNA)
  Assistant (CCNA 1, CCNA 2)`
    ];
    const training = [
        `Company YOU, Sana'a
  Training at Company YOU
  2022/02/12 to 2023/02/26`,
        `Public Telecommunications Corporation
  Training Program
  September 24, 2022 to October 5, 2022`
    ]    

    useEffect(() => {
        setShowEducation(true);
        setShowTraining(true);
        setCurrentEducation(education.length - 1);
        setCurrentTraining(training.length - 1);
    
    }, []);
    
    useEffect(() => {
        if (showEducation) {
            setCurrentEducation(0);
        }
    }, [showEducation]);
    useEffect(() => {
        if (showTraining) {
            setCurrentTraining(0);
        }
    }, [showTraining]);
   
    const handleEducationComplete = () => {
        if (currentEducation < education.length - 1) {
            setCurrentEducation(prev => prev + 1);
        }
    };
    const handleTrainingComplete = () => {
        if (currentTraining < training.length - 1) {
            setCurrentTraining(prev => prev + 1);
        }
    };

    return (
        <div className='flex flex-col gap-4'>                                
            {
                showEducation && (
                    <>
                        <h2 className='text-q mb-2' style={{ marginTop: '2rem' }}>
                            Education
                        </h2>
                        <div className='text-q flex flex-col gap-3'>
                            {education.map((edu, index) => (
                                <q className='text-q text-q-content'
                                    key={index}
                                    style={{ opacity: index <= currentEducation ? 1 : 0, fontSize: '1.2rem' }}
                                >
                                    {index === currentEducation ? (
                                        <TypingAnimation
                                            text={edu}
                                            duration={10}
                                            onComplete={handleEducationComplete}
                                        />
                                    ) : index < currentEducation ? (
                                        edu
                                    ) : null}
                                </q>
                            ))}
                        </div>
                    </>
                )
            }
            {
                showTraining && (
                    <>
                        <h2 className='text-q mb-2' style={{ marginTop: '2rem' }}>
                            Training
                        </h2>
                        <div className='text-q flex flex-col gap-3'>
                            {training.map((train, index) => (
                                <q className='text-q text-q-content'
                                    key={index}
                                    style={{ opacity: index <= currentTraining ? 1 : 0, fontSize: '1.2rem' }}
                                >
                                    {index === currentTraining ? (
                                        <TypingAnimation
                                            text={train}
                                            duration={10}
                                            onComplete={handleTrainingComplete}
                                        />
                                    ) : index < currentTraining ? (
                                        train
                                    ) : null}
                                </q>
                            ))}
                        </div>
                    </>
                )
            }
        </div>
    )
}
