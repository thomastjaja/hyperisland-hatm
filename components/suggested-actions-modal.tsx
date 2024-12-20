import React, { useState, useCallback, useMemo } from 'react';
import { useLanguage } from '@/components/context/language-context';
import { getTranslation } from '@/lib/translations';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

// Organize actions by category
const categories = {
    "All": "all",
    "Samhall Info": "info",
    "Daily Support": "daily",
    "Learning Tools": "learning",
    "Wellbeing Center": "wellbeing",
    "Ask for Help": "help"
} as const;

const extendedSuggestedActions = [
    {
        title: '🚀 Practicalities',
        label: 'Your go-to tool for navigating Samhall',
        action: 'Hi Sammie! I have some questions about getting started at Samhall. Can you help me?',
        category: 'info',
        context: `Your job is to provide clear and concise guidance to new employees at Samhall. Answer questions about locations, daily routines, people to meet, and facilities. Always keep your tone warm, supportive, and practical to ensure employees feel prepared and confident.
        Provide exact answers to questions about:
        - Daily Routine: Mention working hours (7:00 AM - 5:00 PM) and remind them to bring essentials like ID and a notepad.
        - Location: Provide the address in Stockholm (‘Samhall Office, Vasagatan 10, 111 20 Stockholm’). If you’re coming by public transport, take the metro to T-Centralen, then it’s just a 5-minute walk to Vasagatan 10.
        - Who to Meet: You’ll meet your manager, Anna, who will guide you through out your training. You’ll meet Anna, your manager. She’ll be your main contact for the day. You can find her in Room 305 after checking in at reception.
        - Facilities: Mention the lunchroom, restrooms, and quiet spaces for breaks. you’ll find a quiet space in Room 204 if you need some time to focus.
        - Dress Code: Inform them about the dress code (casual) and any safety gear they might need.
        - Transportation: Provide information about public transport options and parking facilities.
        - Need a locker? Ask at reception for access to the locker area, located near the main hall. They’ll assign one for your belongings.
        - Feeling unsure? Don’t worry—Anna will guide you through the day. If you have questions before arriving, you can always reach out to the reception desk at +46 123 456 789.
        `
    },
    {
        title: '👋 Greeting Practice',
        label: 'Practice workplace greetings and introductions',
        action: 'Can we practice how to greet colleagues and introduce myself professionally?',
        category: 'learning',
        context: `Guide this role-play scenario with sensitivity. Remember to:
            - Start with simple, common greetings in Swedish and English
            - Provide clear examples of appropriate greetings and responses
            - Include timing (morning, afternoon, leaving) variations
            - Teach appropriate personal space and body language
            - Give positive reinforcement for each attempt
            - Offer alternatives for those who are anxious
            - Practice both initiating and responding to greetings`
    },
    {
        title: '🤝 Asking for Help',
        label: 'Learn how to politely ask for assistance',
        action: 'I\'d like to practice how to ask for help politely when I need it.',
        category: 'learning',
        context: `Guide through help-seeking scenarios:
            - Emphasize that asking for help is normal and encouraged
            - Provide simple, polite phrases in both Swedish and English
            - Practice identifying when to ask for help
            - Include examples for different situations (task help, directions, clarification)
            - Show how to explain what help is needed clearly
            - Discuss appropriate timing for asking help
            - Include strategies for when feeling overwhelmed`
    },
    {
        title: '🏢 About Samhall',
        label: 'Learn about Samhall\'s mission and values',
        action: 'Can you tell me about Samhall\'s mission, values, and what makes it special?',
        category: 'info',
        context: `Present Samhall information accessibly:
            - Explain mission and values in simple terms
            - Focus on inclusion and growth opportunities
            - Share relevant success stories
            - Highlight available support systems
            - Explain how values connect to daily work
            - Include information about workplace culture
            - Emphasize the supportive environment`
    },
    {
        title: '📋 My Training Program',
        label: 'Understand your role and daily routines',
        action: 'Can you explain my training program, what I\'ll be doing day-to-day, and how I\'ll develop my skills?',
        category: 'learning',
        context: `Break down the training program clearly:
            - Explain the step-by-step training process
            - Describe typical daily activities
            - Highlight key skills they'll develop
            - Include practice opportunities
            - Address common concerns
            - Emphasize self-paced learning
            - Mention available support during training`
    },
    {
        title: '🗺️ Finding My Way',
        label: 'Help with finding important places at work',
        action: 'Where can I find important places like the lunchroom, quiet spaces, and restrooms?',
        category: 'daily',
        context: `Provide clear navigation guidance:
            - Use simple, step-by-step directions
            - Include easy-to-identify landmarks
            - Explain locations of essential facilities
            - Point out quiet spaces for breaks
            - Note accessible routes and entrances
            - Mention emergency exits
            - Identify spaces for sensory breaks`
    },
    {
        title: '📝 Task Reflection',
        label: 'Review and learn from your work tasks',
        action: 'I\'d like to reflect on my tasks today - what went well and what was challenging.',
        category: 'wellbeing',
        context: `Guide reflection with empathy:
            - Ask specific but gentle questions
            - Celebrate small wins
            - Address challenges supportively
            - Help identify learning opportunities
            - Provide positive reinforcement
            - Suggest coping strategies
            - Focus on personal growth`
    },
    {
        title: '🤝 Support & Resources',
        label: 'Learn about available help and support',
        action: 'What kind of support and resources are available to me as a Samhall employee?',
        category: 'help',
        context: `Present support information clearly:
            - List available support personnel and their roles
            - Explain how to access different types of support
            - Describe workplace accommodations available
            - Include both immediate and long-term support options
            - Mention peer support programs
            - Outline mental health resources
            - Explain confidentiality in seeking support`
    },
    {
        title: '🗣️ Communication Skills',
        label: 'Practice effective workplace communication',
        action: 'Help me improve my workplace communication skills',
        category: 'learning',
        context: `Guide communication practice:
            - Focus on clear, simple communication methods
            - Practice common workplace conversations
            - Include both verbal and written communication
            - Teach active listening techniques
            - Provide strategies for difficult conversations
            - Include non-verbal communication tips
            - Practice asking for clarification`
    },
    {
        title: '⚡ Workplace Safety',
        label: 'Learn about safety protocols and procedures',
        action: 'What are the important safety guidelines I need to follow at Samhall?',
        category: 'daily',
        context: `Explain safety guidelines clearly:
            - Break down essential safety rules
            - Describe proper use of equipment
            - Explain emergency procedures
            - Include personal safety practices
            - Cover hygiene and health protocols
            - Identify potential hazards
            - Emphasize when to ask for help`
    },
    {
        title: '📅 Time Management',
        label: 'Tips for managing work schedules',
        action: 'Can you help me with strategies for managing my work schedule effectively?',
        category: 'daily',
        context: `Share time management strategies:
            - Provide simple scheduling techniques
            - Break down daily routines
            - Offer tools for tracking tasks
            - Include break management tips
            - Suggest ways to handle transitions
            - Help with prioritization
            - Address common time challenges`
    },
    {
        title: '😌 Stress Management',
        label: 'Learn techniques to stay calm and focused',
        action: 'Can you help me with ways to manage stress at work?',
        category: 'wellbeing',
        context: `Guide stress management supportively:
            - Share simple calming techniques
            - Identify stress triggers
            - Teach quick relaxation exercises
            - Explain when to take breaks
            - Include grounding techniques
            - Suggest preventive strategies
            - Provide crisis resources`
    },
    {
        title: '🌟 Career Growth',
        label: 'Explore development opportunities',
        action: 'What career development opportunities are available at Samhall?',
        category: 'info',
        context: `Present career information encouragingly:
            - Outline available development paths
            - Explain skill-building opportunities
            - Share success stories
            - Describe training programs
            - Include mentorship options
            - Discuss goal setting
            - Emphasize personal growth`
    },
    {
        title: '👥 Teamwork',
        label: 'Learn about working with colleagues',
        action: 'How can I be a good team member at Samhall?',
        category: 'daily',
        context: `Guide teamwork skills development:
            - Explain team roles and dynamics
            - Practice collaboration scenarios
            - Share cooperation techniques
            - Include conflict resolution tips
            - Emphasize respect and inclusion
            - Discuss team communication
            - Address common challenges`
    },
    {
        title: '💻 Using Work Systems',
        label: 'Learn how to use work platforms and tools',
        action: 'Can you help me understand how to use the onboarding platform and other work systems?',
        category: 'daily',
        context: `Guide through systems with patience:
            - Break down each system step-by-step
            - Explain common functions first
            - Include troubleshooting tips
            - Offer practice exercises
            - Address common mistakes
            - Explain where to find help
            - Emphasize learning at own pace`
    },
    {
        title: '⏰ Morning Schedule',
        label: 'Understanding start times and morning routine',
        action: 'What time should I arrive in the morning and what should my morning routine look like?',
        category: 'daily',
        context: `Explain morning routine clearly:
            - Break down arrival times
            - List preparation steps
            - Include transport planning
            - Suggest evening preparation
            - Address common concerns
            - Include flexibility options
            - Explain check-in procedures`
    },
    {
        title: '🎒 Daily Preparation',
        label: 'What to bring and how to prepare',
        action: 'What do I need to bring with me to work each day?',
        category: 'daily',
        context: `Guide daily preparation thoroughly:
            - Provide complete checklist
            - Explain essential items
            - Include seasonal considerations
            - Suggest organization tips
            - Address special needs items
            - Include backup planning
            - Mention storage options`
    },
    {
        title: '🌱 Progress Check-in',
        label: 'Celebrate achievements and set goals',
        action: 'Let\'s talk about what I\'ve accomplished this week and what I\'m proud of.',
        category: 'wellbeing',
        context: `Guide achievement reflection positively:
            - Celebrate all progress sizes
            - Ask about specific accomplishments
            - Help identify growth areas
            - Set achievable goals
            - Provide encouragement
            - Acknowledge challenges overcome
            - Build confidence through reflection`
    },
    {
        title: '🎯 Focus Skills',
        label: 'Managing distractions and staying focused',
        action: 'Can you help me learn strategies for staying focused when there are distractions?',
        category: 'wellbeing',
        context: `Share focus strategies supportively:
            - Provide practical concentration techniques
            - Identify common distractions
            - Suggest environment adjustments
            - Include break scheduling
            - Teach refocusing methods
            - Address sensory challenges
            - Offer coping strategies`
    }
];

// Create the ActionButton component
const ActionButton = React.memo(({
    action,
    index,
    onAction
}: {
    action: any,  // We'll type this properly later
    index: number,
    onAction: (action: any) => void
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.05 * index }}
    >
        <Button
            variant="ghost"
            onClick={() => onAction(action)}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 flex-col w-full h-auto justify-start items-start"
        >
            <span className="font-medium">{action.title}</span>
            <span className="text-muted-foreground">
                {action.label}
            </span>
        </Button>
    </motion.div>
));

ActionButton.displayName = 'ActionButton';

export function SuggestedActionsWithModal({
    chatId,
    append
}: {
    chatId: string;
    append: (message: any) => Promise<any>;
}) {
    const initialVisibleCount = 2;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories>('All');
    const { language } = useLanguage();

    const handleAction = useCallback((action: typeof extendedSuggestedActions[0]) => {
        window.history.replaceState({}, '', `/chat/${chatId}`);
        setIsOpen(false);
        append({
            role: 'user',
            content: action.action,
            systemMessage: action.context
        });
    }, [chatId, append]);

    const filteredActions = useMemo(() =>
        extendedSuggestedActions.filter(action =>
            selectedCategory === 'All' || action.category === categories[selectedCategory]
        ),
        [selectedCategory]
    );

    const initialActions = useMemo(() => {
        // Create a copy of the array to avoid mutating the original
        const shuffled = [...extendedSuggestedActions]
            .sort(() => Math.random() - 0.5); // Shuffle the array

        // Take first two items from shuffled array
        return shuffled.slice(0, initialVisibleCount);
    }, []); // Empty dependency array means it will create new random selection on each mount

    return (
        <div className="grid gap-2 w-full">
            <div className="grid sm:grid-cols-2 gap-2">
                {initialActions.map((action, index) => (
                    <ActionButton
                        key={`initial-${action.title}`}
                        action={action}
                        index={index}
                        onAction={handleAction}
                    />
                ))}
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full mt-2"
                    >
                        {getTranslation(language, 'suggestedActions.seeMore')}
                    </Button>
                </SheetTrigger>
                <SheetContent
                    side="bottom"
                    className="h-[100dvh] p-0 flex flex-col"
                >
                    <SheetHeader className="px-4 py-3 border-b">
                        <SheetTitle className="text-left">{getTranslation(language, 'suggestedActions.moreWays')}</SheetTitle>

                        <div className="flex gap-2 overflow-x-auto py-2 px-1 -mb-3">
                            {(Object.keys(categories) as Array<keyof typeof categories>).map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className="shrink-0"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto">
                        <div className="grid sm:grid-cols-2 gap-2 p-4">
                            {filteredActions.map((action, index) => (
                                <ActionButton
                                    key={`modal-${action.title}`}
                                    action={action}
                                    index={index}
                                    onAction={handleAction}
                                />
                            ))}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}