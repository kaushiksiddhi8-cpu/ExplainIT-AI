import type {
  UnderstandingLevel,
  ExplanationMode,
  StructuredAnswer,
  QuizItem,
  LearningPath,
  LearningConcept,
  Category,
} from '../types/index';
import { getNextSimplerLevel, getNextDeeperLevel } from './explainLogic';

/**
 * Pre-curated high quality learning paths
 */
export const DEFAULT_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-physics',
    broadTopic: 'Physics: From Apples to the Cosmos',
    description: 'Master the fundamental laws governing motion, energy, gravity, and the fabric of spacetime.',
    icon: 'Atom',
    color: 'from-blue-500 to-indigo-600',
    createdAt: Date.now() - 86400000 * 3,
    lastActiveAt: Date.now() - 86400000 * 1,
    concepts: [
      {
        id: 'phys-1',
        title: 'Force & Motion (Newton\'s Laws)',
        description: 'Why things stay still, speed up, or resist changes in movement.',
        complexity: 'Very Simple',
        suggestedQuestion: 'How does Newton\'s first law explain why seatbelts save lives?',
        subTopic: 'Classical Mechanics',
        status: 'mastered',
        order: 1,
        masteredAt: Date.now() - 86400000 * 2,
      },
      {
        id: 'phys-2',
        title: 'Gravity & Planetary Orbits',
        description: 'How mass attracts mass and keeps moons and planets in perpetual freefall.',
        complexity: 'Simple',
        suggestedQuestion: 'Why does the Moon not crash into Earth if gravity pulls it?',
        subTopic: 'Gravitation',
        status: 'mastered',
        order: 2,
        masteredAt: Date.now() - 86400000 * 1,
      },
      {
        id: 'phys-3',
        title: 'Conservation of Energy & Work',
        description: 'Potential vs kinetic energy, heat friction, and thermodynamic limits.',
        complexity: 'Normal',
        suggestedQuestion: 'How does a roller coaster convert height into terrifying speed without an engine?',
        subTopic: 'Energy & Work',
        status: 'in_progress',
        order: 3,
      },
      {
        id: 'phys-4',
        title: 'Electromagnetism & Light Waves',
        description: 'Electric charges, magnetic fields, and how photons travel through a vacuum.',
        complexity: 'Detailed',
        suggestedQuestion: 'Why can light travel through the vacuum of space when sound cannot?',
        subTopic: 'Electromagnetism',
        status: 'not_started',
        order: 4,
      },
      {
        id: 'phys-5',
        title: 'General Relativity & Curved Spacetime',
        description: 'Einstein\'s breakthrough that gravity is not a pull, but the curvature of space.',
        complexity: 'Advanced',
        suggestedQuestion: 'How does massive matter bend space and slow down time near black holes?',
        subTopic: 'Modern Astrophysics',
        status: 'revisit',
        order: 5,
      },
    ],
  },
  {
    id: 'path-cs-ai',
    broadTopic: 'Computer Science & AI',
    description: 'Understand how computers think, from silicon transistors to neural networks.',
    icon: 'Cpu',
    color: 'from-violet-500 to-purple-600',
    createdAt: Date.now() - 86400000 * 5,
    lastActiveAt: Date.now() - 86400000 * 2,
    concepts: [
      {
        id: 'cs-1',
        title: 'Bits, Bytes & Logic Gates',
        description: 'How switches turning on and off calculate anything in the universe.',
        complexity: 'Very Simple',
        suggestedQuestion: 'How do 1s and 0s make music, pictures, and video games?',
        subTopic: 'Digital Foundations',
        status: 'mastered',
        order: 1,
        masteredAt: Date.now() - 86400000 * 4,
      },
      {
        id: 'cs-2',
        title: 'Algorithms & Step-by-Step Problem Solving',
        description: 'The recipes and recipes of computing: sorting, searching, and decision trees.',
        complexity: 'Simple',
        suggestedQuestion: 'What is an algorithm and how does a phone sort contacts in milliseconds?',
        subTopic: 'Algorithms',
        status: 'mastered',
        order: 2,
        masteredAt: Date.now() - 86400000 * 3,
      },
      {
        id: 'cs-3',
        title: 'The Internet & Client-Server Architecture',
        description: 'Packets, DNS, routers, and how web pages arrive from across oceans in seconds.',
        complexity: 'Normal',
        suggestedQuestion: 'What happens in the 0.2 seconds between typing a URL and seeing the page?',
        subTopic: 'Networks & Web',
        status: 'in_progress',
        order: 3,
      },
      {
        id: 'cs-4',
        title: 'Machine Learning & Neural Networks',
        description: 'Training weights, gradient descent, and how computers recognize cats in photos.',
        complexity: 'Detailed',
        suggestedQuestion: 'How does a neural network adjust mathematical weights to learn from mistakes?',
        subTopic: 'Artificial Intelligence',
        status: 'not_started',
        order: 4,
      },
      {
        id: 'cs-5',
        title: 'Transformers & Large Language Models',
        description: 'Attention mechanisms, token embeddings, and how generative AI constructs prose.',
        complexity: 'Advanced',
        suggestedQuestion: 'How does self-attention in Transformer models calculate token relationships?',
        subTopic: 'Generative AI',
        status: 'not_started',
        order: 5,
      },
    ],
  },
  {
    id: 'path-biology',
    broadTopic: 'Biology & The Human Body',
    description: 'Explore the wondrous living machinery within our cells, organs, and genetic code.',
    icon: 'Dna',
    color: 'from-emerald-500 to-teal-600',
    createdAt: Date.now() - 86400000 * 2,
    lastActiveAt: Date.now() - 86400000 * 1,
    concepts: [
      {
        id: 'bio-1',
        title: 'Cells: The Tiny Building Blocks',
        description: 'Nucleus, mitochondria, and cell membranes operating like miniature cities.',
        complexity: 'Very Simple',
        suggestedQuestion: 'Why are cells called the building blocks of our bodies?',
        subTopic: 'Cell Biology',
        status: 'mastered',
        order: 1,
      },
      {
        id: 'bio-2',
        title: 'How the Heart & Blood Vessel Network Works',
        description: 'Pumping oxygen, removing waste, and maintaining blood pressure.',
        complexity: 'Simple',
        suggestedQuestion: 'How does blood deliver oxygen to our toes and return back to the lungs?',
        subTopic: 'Circulatory System',
        status: 'in_progress',
        order: 2,
      },
      {
        id: 'bio-3',
        title: 'The Immune Defense Army & Vaccines',
        description: 'Antibodies, T-cells, memory cells, and biological training grounds.',
        complexity: 'Normal',
        suggestedQuestion: 'How do vaccines teach memory B-cells to recognize dangerous viruses?',
        subTopic: 'Immunology',
        status: 'revisit',
        order: 3,
      },
      {
        id: 'bio-4',
        title: 'DNA, RNA & Protein Synthesis',
        description: 'Transcription, translation, amino acids, and the blueprint of life.',
        complexity: 'Detailed',
        suggestedQuestion: 'How does mRNA carry genetic code from the nucleus to ribosomes?',
        subTopic: 'Genetics',
        status: 'not_started',
        order: 4,
      },
      {
        id: 'bio-5',
        title: 'CRISPR & Gene Editing Frontiers',
        description: 'Cas9 guide RNA, double-strand breaks, and modifying eukaryotic genomes.',
        complexity: 'Advanced',
        suggestedQuestion: 'What are the precise molecular mechanisms behind CRISPR-Cas9 genome editing?',
        subTopic: 'Biotechnology',
        status: 'not_started',
        order: 5,
      },
    ],
  },
  {
    id: 'path-finance',
    broadTopic: 'Money, Economics & Markets',
    description: 'Deconstruct money, inflation, compound interest, stock markets, and global trade.',
    icon: 'TrendingUp',
    color: 'from-amber-500 to-orange-600',
    createdAt: Date.now() - 86400000 * 7,
    lastActiveAt: Date.now() - 86400000 * 4,
    concepts: [
      {
        id: 'fin-1',
        title: 'What is Money & Why Do We Trust It?',
        description: 'From cowrie shells and gold coins to paper fiat currency and digital balances.',
        complexity: 'Very Simple',
        suggestedQuestion: 'Why does a paper dollar bill have value when it is just colored paper?',
        subTopic: 'Money Foundations',
        status: 'mastered',
        order: 1,
      },
      {
        id: 'fin-2',
        title: 'Supply, Demand & Price Discovery',
        description: 'Why concert tickets get expensive and how buyers and sellers agree on price.',
        complexity: 'Simple',
        suggestedQuestion: 'How does supply and demand determine the price of an apple or a car?',
        subTopic: 'Microeconomics',
        status: 'in_progress',
        order: 2,
      },
      {
        id: 'fin-3',
        title: 'Inflation & Central Bank Interest Rates',
        description: 'Why things cost more over time and how interest rate hikes cool an economy.',
        complexity: 'Normal',
        suggestedQuestion: 'Why does printing more money make groceries and houses more expensive?',
        subTopic: 'Macroeconomics',
        status: 'not_started',
        order: 3,
      },
      {
        id: 'fin-4',
        title: 'Stock Markets, Bonds & Fractional Ownership',
        description: 'Equity, dividends, yields, and collective corporate ownership.',
        complexity: 'Detailed',
        suggestedQuestion: 'What does owning one share of a company actually give you legally?',
        subTopic: 'Capital Markets',
        status: 'not_started',
        order: 4,
      },
      {
        id: 'fin-5',
        title: 'Derivatives, Liquidity & Systemic Risk',
        description: 'Options, futures, leverage, and the interconnected banking ecosystem.',
        complexity: 'Advanced',
        suggestedQuestion: 'How do credit default swaps and leverage amplify risk during financial crises?',
        subTopic: 'Financial Engineering',
        status: 'not_started',
        order: 5,
      },
    ],
  },
];

export const POPULAR_QUESTIONS = [
  'Why is the sky blue?',
  'How does ChatGPT work?',
  'What is Quantum Computing?',
  'How does an airplane stay in the air?',
  'Why do we need to sleep?',
  'What actually is a Black Hole?',
  'How do vaccines protect our body?',
  'Why does printing money cause inflation?',
  'How does Wi-Fi send information through walls?',
  'How do electric cars work compared to gas cars?',
];

export const CATEGORY_DATA: Array<{
  id: Category;
  name: string;
  emoji: string;
  description: string;
  sampleQuestions: string[];
  gradient: string;
}> = [
  {
    id: 'Study',
    name: 'Study',
    emoji: '📚',
    description: 'Exam concepts, effective learning methods, history, and essay topics',
    sampleQuestions: [
      'What caused World War I in simple terms?',
      'How does the brain remember information during study?',
      'What is the scientific method step by step?',
    ],
    gradient: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
  },
  {
    id: 'Science',
    name: 'Science',
    emoji: '🔬',
    description: 'Biology, chemistry, physics, atoms, galaxies, and natural phenomena',
    sampleQuestions: [
      'Why is the sky blue during the day and red at sunset?',
      'What are atoms made of?',
      'How does photosynthesis feed the planet?',
    ],
    gradient: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
  },
  {
    id: 'Maths',
    name: 'Maths',
    emoji: '➗',
    description: 'Calculus, algebra, geometry, probability, and mental arithmetic tricks',
    sampleQuestions: [
      'What actually is Calculus and why do we use it?',
      'Why can you not divide any number by zero?',
      'What is the Pythagorean theorem and how is it used?',
    ],
    gradient: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'Technology',
    name: 'Technology',
    emoji: '💻',
    description: 'AI, coding, computers, internet, smartphones, and blockchain',
    sampleQuestions: [
      'How does Artificial Intelligence actually learn?',
      'How does Wi-Fi send data through the air without wires?',
      'What is a blockchain and why is it secure?',
    ],
    gradient: 'from-violet-500/10 to-purple-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400',
  },
  {
    id: 'General Knowledge',
    name: 'General Knowledge',
    emoji: '🌎',
    description: 'World geography, human culture, government, economics, and history',
    sampleQuestions: [
      'Why do countries have different time zones?',
      'What causes inflation and price hikes?',
      'How do elections and democratic voting work?',
    ],
    gradient: 'from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
  },
  {
    id: 'Languages',
    name: 'Languages',
    emoji: '🗣',
    description: 'Grammar, word origins, linguistics, idioms, and language evolution',
    sampleQuestions: [
      'Why does English have so many irregular spelling rules?',
      'How did human speech and language evolve?',
      'What makes Latin the root of Romance languages?',
    ],
    gradient: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'How Things Work',
    name: 'How Things Work',
    emoji: '💡',
    description: 'Airplanes, refrigerators, microwave ovens, GPS, and everyday gadgets',
    sampleQuestions: [
      'How do airplanes fly and generate lift?',
      'How does a microwave oven heat food without a fire?',
      'How does GPS on a phone know your exact street location?',
    ],
    gradient: 'from-fuchsia-500/10 to-pink-500/10 border-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400',
  },
];

/**
 * Built-in rich knowledge base for instant answers and demo resilience
 */
interface TopicKnowledge {
  keywords: string[];
  category: Category;
  tags: string[];
  variants: Record<
    UnderstandingLevel,
    Record<
      ExplanationMode,
      {
        quickAnswer: string;
        easyExplanation: string;
        example: string;
        keyPoints: string[];
        formulasOrTips?: string[];
      }
    >
  >;
  quizzes: QuizItem[];
}

export const KNOWLEDGE_BASE: Record<string, TopicKnowledge> = {
  sky_blue: {
    keywords: ['sky', 'blue', 'sunlight', 'atmosphere', 'rayleigh'],
    category: 'Science',
    tags: ['light', 'physics', 'atmosphere', 'optics'],
    variants: {
      'Very Simple': {
        Kid: {
          quickAnswer: 'The sky is blue because sunlight plays tag with the air, and blue light bounces in every direction!',
          easyExplanation: 'Sunlight looks white, but it has every rainbow color tucked inside. The air around Earth is packed with tiny gas bubbles. Red and yellow lights zoom straight through, but little blue light bounces like a bouncy ball into your eyes!',
          example: 'Imagine throwing rubber balls down a hallway. Big red bowling balls roll straight ahead, but tiny bouncy blue balls ricochet off the walls all over the place.',
          keyPoints: [
            'Sunlight has all colors inside it',
            'Air is full of tiny gas particles',
            'Blue light bounces around the most',
            'Our eyes spot the bouncing blue everywhere above',
          ],
        },
        Simple: {
          quickAnswer: 'Sunlight bounces off the air, and blue color scatters more than other colors.',
          easyExplanation: 'Sunlight is made of all colors mixed together. When sunlight enters Earth\'s air, tiny gas molecules scatter the blue light all over the sky, so we see blue wherever we look.',
          example: 'If you shine a flashlight into a glass of water with a drop of milk, the water glows soft blue because the milk scatters blue light.',
          keyPoints: [
            'White sunlight contains all colors',
            'Air molecules scatter blue light',
            'Red and yellow pass straight through',
            'The sky glows blue all day',
          ],
        },
        Standard: {
          quickAnswer: 'The sky appears blue due to Rayleigh scattering, where Earth\'s atmosphere scatters shorter blue wavelengths of sunlight far more than longer red ones.',
          easyExplanation: 'Sunlight reaches Earth\'s atmosphere and is scattered in all directions by gases and particles in the air. Blue light travels in smaller, shorter waves than other colors. Because blue waves are short, they collide with gas molecules and scatter across the entire sky.',
          example: 'Think of sea waves hitting a pier: long ocean swells roll past the pilings without noticing, while short, choppy ripples splash wildly in all directions.',
          keyPoints: [
            'Sunlight combines all visible wavelengths',
            'Nitrogen and oxygen molecules scatter light',
            'Shorter wavelengths (blue/violet) scatter 10x more than red',
            'Human eyes are much more sensitive to blue than violet',
          ],
        },
        Student: {
          quickAnswer: 'Rayleigh scattering describes the elastic scattering of electromagnetic radiation by particles much smaller than the wavelength, with intensity proportional to 1/λ⁴.',
          easyExplanation: 'White light from the Sun enters Earth\'s atmosphere. Because the radius of N₂ and O₂ molecules is much smaller than the wavelength of light (~0.1 nm vs ~400–700 nm), scattering intensity scales inversely with the fourth power of wavelength (I ∝ 1/λ⁴). Blue light (~450 nm) scatters ~10 times more intensely than red light (~700 nm).',
          example: 'At sunset, sunlight must travel through a much thicker slice of atmosphere; the blue is scattered away out of your line of sight, leaving the unscattered long red and orange wavelengths.',
          keyPoints: [
            'Rayleigh scattering formula: I ∝ 1/λ⁴',
            'Blue light (400–480 nm) scatters ~10x stronger than red light (650–700 nm)',
            'Human trichromatic vision has M and S cone peaks favoring blue over violet',
            'Sunsets are orange/red due to atmospheric path length attenuation',
          ],
          formulasOrTips: [
            'Formula: Rayleigh Scattering Intensity I ∝ (1 + cos²θ) / (r² · λ⁴)',
            'Study Tip: Remember ROYGBIV — Blue has short λ, high frequency, and maximum scattering.',
          ],
        },
      },
      'Simple': {
        Kid: {
          quickAnswer: 'The sky is blue because sunlight bounces off air particles and throws a blue light party in the sky!',
          easyExplanation: 'Sunlight seems white, but it is actually a rainbow hidden in plain sight. Tiny pieces of air in our sky love to catch the blue light and throw it around in every direction. That makes the whole ceiling of the world look bright blue.',
          example: 'Like splashing water in a pool — tiny droplets fly everywhere and sparkle in the sun.',
          keyPoints: [
            'Sunlight is made of all colors',
            'Air catches blue light easily',
            'Blue bounces in all directions',
          ],
        },
        Simple: {
          quickAnswer: 'Air molecules scatter the blue part of sunlight in every direction.',
          easyExplanation: 'Light travels from the Sun to Earth. White light contains all rainbow colors. Blue light has small waves that bounce off gases in the air. This scattering spreads blue light across the entire dome of the sky.',
          example: 'A prism splits sunlight into a rainbow; the atmosphere does a similar trick by scattering the blue part all around us.',
          keyPoints: [
            'Sunlight contains all colors',
            'Blue light has short waves',
            'Gases scatter blue light all over the sky',
          ],
        },
        Standard: {
          quickAnswer: 'Sunlight scatters through Earth\'s atmosphere, and because blue light travels as shorter, smaller waves, it scatters much more than other colors.',
          easyExplanation: 'When sunlight reaches the atmosphere, gas molecules (mostly nitrogen and oxygen) redirect the light waves. Shorter wavelengths (blue and violet) are deflected repeatedly in all directions, coloring the sky. Although violet scatters even more than blue, our eyes are significantly more receptive to blue photons.',
          example: 'Dust motes in a projector beam glow bright because they scatter light; atmospheric gas molecules do the same thing on a planetary scale with blue wavelengths.',
          keyPoints: [
            'Atmospheric gases redirect short light waves',
            'Blue waves scatter far more than red and yellow',
            'Human retinal receptors are tuned toward blue over violet',
          ],
        },
        Student: {
          quickAnswer: 'Differential Rayleigh scattering of short visible wavelengths by atmospheric nitrogen and oxygen causes diffuse sky radiation predominantly in the blue spectrum.',
          easyExplanation: 'Solar radiation passes through Earth\'s gaseous envelope. Gas particles have dimensions far smaller than optical wavelengths. According to Rayleigh scattering, the scattering cross-section is inversely proportional to λ⁴. Consequently, blue light around 450 nm experiences roughly 9.4 times more scattering than 700 nm red light, establishing the diffuse daylight sky glow.',
          example: 'On the Moon, where there is no atmosphere to scatter light, the sky appears pitch black even when the Sun is blazing in full view.',
          keyPoints: [
            'Particle size d << λ enables Rayleigh scattering regime',
            'Wavelength dependence: λ_blue ≈ 450 nm vs λ_red ≈ 700 nm',
            'Lunar contrast: No atmosphere = completely black sky during day',
          ],
          formulasOrTips: [
            'Key Formula: Scattering cross section σ_s = (8π/3) * (2π/λ)⁴ * ((n² - 1)/(n² + 2))² * r⁶',
            'Exam Note: Distinguish Rayleigh scattering (gas molecules) from Mie scattering (large clouds/water droplets).',
          ],
        },
      },
      'Normal': {
        Kid: {
          quickAnswer: 'The sky is blue because sunlight is full of rainbow colors, and Earth\'s air scatters the energetic blue colors in every direction!',
          easyExplanation: 'The Sun shines bright white light onto our planet. But white light is actually a team of red, orange, yellow, green, blue, and purple rays! When this team hits our air, the red and yellow rays walk straight down to our feet, but the energetic little blue rays bump into air molecules and bounce all over the sky like ping-pong balls.',
          example: 'Think of a garden hose spray: large heavy droplets shoot straight, while fine mist scatters into a wide cloud all around.',
          keyPoints: [
            'Sunlight is made of all rainbow colors',
            'Blue light waves are short and bounce easily',
            'Air molecules scatter blue in every direction',
            'Our eyes look up and see that scattered blue light',
          ],
        },
        Simple: {
          quickAnswer: 'Earth\'s atmosphere scatters shorter blue light waves from the Sun much more than other colors.',
          easyExplanation: 'Light from the Sun arrives in waves of different lengths. Red light has long waves that pass straight through air. Blue light has short, choppy waves that crash into gas molecules in the atmosphere. These collisions bounce blue light across the sky in all directions.',
          example: 'A glass prism breaks white light into a rainbow; air molecules do something similar by scattering the blue waves.',
          keyPoints: [
            'Sunlight contains the entire spectrum of colors',
            'Blue light waves are short and bounce off air molecules',
            'Red waves pass through without scattering much',
            'We see blue light coming from every point in the sky',
          ],
        },
        Standard: {
          quickAnswer: 'The sky appears blue because molecules in Earth\'s atmosphere scatter short-wavelength blue sunlight in all directions through Rayleigh scattering.',
          easyExplanation: 'Sunlight appears white, but it is composed of a spectrum of colors with different wavelengths. Red wavelengths are long (around 700 nm), while blue wavelengths are short (around 450 nm). When sunlight strikes the gases in our atmosphere—chiefly nitrogen and oxygen—the shorter wavelengths are scattered much more vigorously than the longer ones. Because blue light is scattered across the entire atmosphere, whenever you look up away from the direct sun, you see this scattered blue light.',
          example: 'Imagine tossing pebbles and beach balls into choppy water: the pebbles get deflected by every small ripple, while the beach balls roll right through uninterrupted.',
          keyPoints: [
            'Atmosphere composed primarily of Nitrogen (78%) and Oxygen (21%)',
            'Shorter wavelengths scatter exponentially more than longer wavelengths',
            'Scattering efficiency scales inversely with the fourth power of wavelength (1/λ⁴)',
            'Sunsets appear red/orange because the longer path length scatters away blue light before it reaches your eye',
          ],
        },
        Student: {
          quickAnswer: 'Earth\'s blue sky is produced by Rayleigh scattering of solar radiation by atmospheric gas molecules, where scattering intensity is inversely proportional to the fourth power of wavelength (I ∝ 1/λ⁴).',
          easyExplanation: 'Incoming solar electromagnetic radiation interacts with dipole polarizability in nitrogen and oxygen molecules. Because molecular diameters (~0.3 nm) are negligible relative to visible wavelengths (380–750 nm), Rayleigh scattering applies. Blue light (450 nm) experiences approximately 9.4 times greater scattering than red light (700 nm). Violet scatters even more, but the solar spectrum emits fewer violet photons, and human eye photopigments (S, M, and L cones) are far more responsive to blue.',
          example: 'Compare daylight with sunsets: at zenith, atmospheric optical depth is 1 air mass; at twilight, light traverses up to 38 air masses, stripping all short wavelengths and leaving unscattered reds and oranges.',
          keyPoints: [
            'Rayleigh scattering regime: particle size d << λ',
            'Intensity relationship: I_scattered ∝ 1/λ⁴',
            'Human ocular physiology: Blue sensitivity peaks above violet cone response',
            'Mie scattering (clouds, aerosols) is wavelength-independent, which is why clouds look white',
          ],
          formulasOrTips: [
            'Fundamental Law: I(λ) = I₀ · (8π⁴Nα² / R²λ⁴) · (1 + cos²θ)',
            'Contrast: Rayleigh (λ-dependent, clear sky) vs Mie (λ-independent, white clouds).',
          ],
        },
      },
      'Detailed': {
        Kid: {
          quickAnswer: 'Tiny air molecules in our atmosphere act like miniature mirrors that bounce energetic blue light rays in every direction!',
          easyExplanation: 'When sunlight travels through deep space, all colors travel together like best friends holding hands. But as soon as they crash into Earth\'s thick blanket of air, things change! Blue light has lots of energy and travels in tiny zig-zag waves. Air molecules bump into these little blue waves and bounce them around like glitter falling in water. That fills the whole sky with brilliant blue light!',
          example: 'Shining a laser through soapy water: the soap particles catch the beam and make the whole container glow from within.',
          keyPoints: [
            'White sunlight is a mixture of all visible colors',
            'Blue light has high energy and short, fast waves',
            'Nitrogen and oxygen particles bounce blue light repeatedly',
            'This creates a glowing blue dome over our planet',
          ],
        },
        Simple: {
          quickAnswer: 'Sunlight is split and redirected by atmospheric gases, with blue wavelengths scattered ten times more strongly than red wavelengths.',
          easyExplanation: 'Earth is surrounded by an atmosphere composed of nitrogen, oxygen, and trace gases. Light from the Sun consists of multiple wavelengths. When these waves encounter atmospheric particles smaller than their wavelength, the shorter waves (blue and violet) are deflected repeatedly. By the time sunlight reaches the ground, blue light has been diffused throughout the entire sky.',
          example: 'On an overcast day, water droplets are large and scatter all colors equally, producing white or gray skies. Clear air has tiny particles that selectively scatter blue.',
          keyPoints: [
            'Clear air selectively deflects short wavelengths of light',
            'Scattered light arrives at your eyes from every angle above',
            'Direct sunlight remains slightly yellowish because blue was extracted',
            'Cloud droplets are too large to separate colors, appearing white',
          ],
        },
        Standard: {
          quickAnswer: 'The blue sky is governed by Rayleigh scattering, where electromagnetic waves induce oscillating dipoles in N₂ and O₂ molecules, preferentially re-radiating short blue wavelengths.',
          easyExplanation: 'As solar electromagnetic radiation penetrates the upper atmosphere, its alternating electric field polarizes the electron clouds of nitrogen and oxygen molecules, setting up microscopic electric dipoles. These induced dipoles oscillate at the frequency of the incident radiation and emit secondary radiation in all directions. Because this dipole radiation power is proportional to the fourth power of frequency (and thus 1/λ⁴), shorter blue wavelengths (~450 nm) are scattered roughly ten times more efficiently than red wavelengths (~700 nm).',
          example: 'A polarizing filter rotated in front of a camera at 90 degrees to the Sun can dramatically darken the blue sky because scattered light is highly polarized.',
          keyPoints: [
            'Oscillating molecular dipoles re-radiate electromagnetic waves in dipole patterns',
            'Scattering cross-section: σ ∝ 1/λ⁴ explains the intense blue predominance',
            'Solar spectrum solar irradiance peaks near green-blue wavelengths',
            'Rayleigh-scattered sky light is strongly linearly polarized at 90° from the sun',
          ],
        },
        Student: {
          quickAnswer: 'Rayleigh scattering by molecular nitrogen and oxygen drives preferential short-wavelength emission (I ∝ λ⁻⁴), modulated by solar spectral irradiance and human retinal cone photoreceptor sensitivities.',
          easyExplanation: 'The macroscopic blue sky is the integral of dipole radiation from atmospheric gas molecules under unpolarized solar irradiance. At standard temperature and pressure, the mean molecular spacing is ~3 nm, far smaller than optical wavelengths (380–740 nm). Random density fluctuations cancel coherent forward scattering and produce incoherent diffuse scattering. The scattered intensity follows I(θ) = I₀ * [(8π⁴ α²) / (r² λ⁴)] * [(1 + cos²θ)/2], demonstrating strong wavelength selectivity and characteristic dipole angular distribution.',
          example: 'Extinction in astronomy: Star spectra observed at high zenith angles show blue extinction, requiring astronomers to correct photometric data using atmospheric air mass coefficients.',
          keyPoints: [
            'Molecular density fluctuations produce incoherent phase scattering',
            'Mean free path of optical photons in air at sea level is ~30 km for red, ~6 km for blue',
            'Angular distribution follows (1 + cos²θ) dipole scattering pattern',
            'Ozone Chappuis absorption bands slightly enhance blue saturation in twilight sky',
          ],
          formulasOrTips: [
            'Cross Section: σ_R = (8π/3) * (2π/λ)⁴ * |(m² - 1)/(m² + 2)|² * (3/(4πN))²',
            'Optical Depth: τ(λ) = ∫ σ_R(λ) N(z) dz ∝ λ⁻⁴',
          ],
        },
      },
      'Advanced': {
        Kid: {
          quickAnswer: 'Earth\'s air is filled with billions of microscopic helpers that catch energetic blue sunshine and scatter it everywhere so we can see it!',
          easyExplanation: 'Imagine the Sun sends down billions of tiny laser beams of every color. Red beams are heavy and march straight ahead. Blue beams are light and springy! When blue beams smack into tiny oxygen and nitrogen molecules in the sky, the molecules act like mini musical bells that ring out blue light in every direction. That turns our whole sky into a glowing blue cathedral!',
          example: 'Like spraying air freshener in a sunny room: before the spray the air is invisible, but once the particles arrive, the sunlight bounces off them and makes beams visible.',
          keyPoints: [
            'Sunlight brings all spectrum colors to Earth',
            'Tiny air molecules bounce blue light specifically',
            'Blue light spreads across all 360 degrees of the horizon',
          ],
        },
        Simple: {
          quickAnswer: 'The physical mechanism is Rayleigh scattering: small atmospheric molecules scatter shorter blue wavelengths roughly 10 times more efficiently than longer red wavelengths.',
          easyExplanation: 'Light is an electromagnetic wave. When it hits gas molecules smaller than its wavelength, the electric field shakes the electrons in the gas. This shaking causes the molecule to emit new light waves in all directions. Because blue light waves oscillate much faster and are shorter in length, they cause far more emission than slow, long red waves. Looking away from the sun, your eyes receive this scattered blue glow from all directions.',
          example: 'In clean mountain air, the sky appears a deeper, darker blue because there are fewer large dust particles to cause white diffuse haze.',
          keyPoints: [
            'Electromagnetic waves shake molecular electron clouds',
            'High-frequency blue waves cause substantially higher re-radiation',
            'Absence of large dust preserves deep Rayleigh blue saturation',
          ],
        },
        Standard: {
          quickAnswer: 'The phenomenon arises from microscopic dielectric fluctuations in Earth\'s gaseous atmosphere, inducing dipole re-radiation that scales inversely with the fourth power of wavelength (1/λ⁴).',
          easyExplanation: 'A continuous, perfectly uniform medium produces no scattering because scattered wavelets interfere destructively in all directions except the forward path. In Earth\'s atmosphere, thermodynamic density fluctuations at the microscopic scale break this symmetry, giving rise to incoherent Rayleigh scattering. Nitrogen and oxygen possess dynamic polarizability α(ω); under solar irradiation, these induced dipoles re-radiate optical power proportional to ω⁴ (or 1/λ⁴). Blue light (450 nm) scatters ~9.4× more intensely than red light (700 nm). While 400 nm violet light scatters ~16× more than red, human photopic vision relies on L and M cones that exhibit low quantum efficiency at violet wavelengths, perceiving the sky as cyan-blue.',
          example: 'Liquid nitrogen and oxygen also demonstrate Rayleigh scattering in cryogenic laboratory chambers, appearing slightly translucent blue under strong illumination.',
          keyPoints: [
            'Thermodynamic density fluctuations cause incoherent Rayleigh scattering',
            'Scattering efficiency scales as ω⁴ (frequency to the fourth power)',
            'Forward transmission retains red (Beer-Lambert attenuation)',
            'Perceived chromaticity coordinates (CIE 1931) map to ~480 nm dominant wavelength',
          ],
        },
        Student: {
          quickAnswer: 'The daylight sky spectrum is synthesized from Rayleigh dipole scattering from thermodynamic density fluctuations in a neutral diatomic gas mixture (78% N₂, 21% O₂), integrated over solar spectral irradiance and CIE standard observer tristimulus functions.',
          easyExplanation: 'From Maxwell\'s equations and classical electrodynamics, an unpolarized electromagnetic wave incident on an isotropic polarizable particle of radius r << λ induces an electric dipole p = α E. The total scattered power per unit solid angle is dP/dΩ = (ω⁴ / 32π² ε₀ c³) |p|² (1 + cos²θ). In a bulk gas, Einstein-Smoluchowski fluctuation theory establishes that scattering originates from local isothermal compressibility: (Δn)² ∝ kT ρ² κ_T / V. The resultant Rayleigh scattering cross-section per molecule is σ_scat = (8π³/3) * (n² - 1)² / (N² λ⁴) * [(6 + 3ρ_n)/(6 - 7ρ_n)], where ρ_n is the King depolarization factor accounting for molecular optical anisotropy. The solar spectrum F(λ) multiplied by e^(-τ(λ)/cos θ_z) and convolved with human cone sensitivities LMS produces peak chromaticity in the blue spectrum.',
          example: 'Polarization of skylight: At a scattering angle θ = 90°, the degree of linear polarization P = (1 - cos²θ) / (1 + cos²θ) reaches nearly 100% in pure Rayleigh theory (attenuated to ~75–85% by multiple scattering and aerosols in real atmosphere).',
          keyPoints: [
            'Einstein-Smoluchowski density fluctuation theorem governs bulk gas scattering',
            'King depolarization factor (ρ_n ≈ 0.03 for air) incorporates molecular anisotropy',
            'Degree of linear polarization reaches maximum at 90° from the solar vector (Babinet and Brewster neutral points)',
            'Multiple scattering and aerosol Mie scattering reduce polarization and dilute chromatic purity',
          ],
          formulasOrTips: [
            'Rayleigh Cross-Section: σ_R(λ) = [24π³ / (N² λ⁴)] · [(n² - 1)² / (n² + 2)²] · F_k(λ)',
            'King Factor: F_k = (6 + 3ρ_n) / (6 - 7ρ_n), where ρ_n ≈ 0.0305 for dry air.',
            'CIE Coordinates: X = ∫ F_sky(λ) x̄(λ) dλ, Y = ∫ F_sky(λ) ȳ(λ) dλ, Z = ∫ F_sky(λ) z̄(λ) dλ.',
          ],
        },
      },
    },
    quizzes: [
      {
        id: 'sky-q1',
        question: 'Which light wavelength scatters the most in Earth\'s atmosphere?',
        options: ['Red (long waves)', 'Yellow (medium waves)', 'Blue (short waves)', 'Infrared (invisible heat)'],
        correctIndex: 2,
        explanation: 'Blue light travels in shorter, smaller waves and scatters much more vigorously than longer red waves.',
      },
      {
        id: 'sky-q2',
        question: 'What is the name of the physical process that causes the sky to be blue?',
        options: ['Doppler effect', 'Rayleigh scattering', 'Refraction through clouds', 'Total internal reflection'],
        correctIndex: 1,
        explanation: 'Rayleigh scattering occurs when light particles hit molecules much smaller than the light\'s wavelength.',
      },
      {
        id: 'sky-q3',
        question: 'Why does the sky turn orange and red at sunrise and sunset?',
        options: [
          'The Sun cools down in the evening',
          'Sunlight passes through much thicker atmosphere, scattering away blue light',
          'Earth stops rotating at sunset',
          'Clouds absorb all blue light at night',
        ],
        correctIndex: 1,
        explanation: 'At sunset, sunlight travels through up to 38x more atmosphere, which scatters away all blue light before it reaches your eyes.',
      },
    ],
  },
  chatgpt_ai: {
    keywords: ['chatgpt', 'ai', 'artificial intelligence', 'llm', 'transformer', 'neural network'],
    category: 'Technology',
    tags: ['ai', 'transformers', 'machine learning', 'tech'],
    variants: {
      'Very Simple': {
        Kid: {
          quickAnswer: 'ChatGPT is like a super-smart computer reader that read millions of books and guesses the best words to say next!',
          easyExplanation: 'Imagine you had a friend who read every story, recipe, and encyclopedia in the entire world. When you ask them a question, their computer brain thinks: "Based on everything I read, what is the friendliest, most helpful next sentence to write?"',
          example: 'Like the autocomplete on a tablet keyboard that guesses the next word you want to type, but billions of times smarter!',
          keyPoints: [
            'ChatGPT was trained on millions of digital books and articles',
            'It predicts what words should come next',
            'It does not have real feelings, it does clever math',
            'It helps explain things, write poems, and answer questions',
          ],
        },
        Simple: {
          quickAnswer: 'ChatGPT is an AI language model trained on massive amounts of text to predict the most helpful words in response to your prompts.',
          easyExplanation: 'Computers cannot feel or think like humans. Instead, ChatGPT was fed vast libraries of internet text. It learned patterns in how words connect together. When you type a question, it calculates which words are most likely to answer your question accurately and naturally.',
          example: 'Just like a musician who has heard ten thousand songs and can improvise a new melody in that style instantly.',
          keyPoints: [
            'Trained on enormous collections of human writing',
            'Uses pattern recognition to form sentences',
            'Computes probabilities for the best next words',
            'Learns from human feedback to be safe and polite',
          ],
        },
        Standard: {
          quickAnswer: 'ChatGPT is a Large Language Model based on the Transformer architecture that generates responses by predicting subsequent tokens using learned statistical patterns.',
          easyExplanation: 'ChatGPT was trained in two main stages: pre-training and fine-tuning. During pre-training, it processed hundreds of billions of words from books, articles, and websites, learning grammar, facts, and reasoning patterns. In the second stage, human trainers guided it using Reinforcement Learning from Human Feedback (RLHF) to make its responses helpful, truthful, and safe.',
          example: 'Autocomplete on your smartphone predicts the next single word; ChatGPT predicts entire paragraphs of complex logic, code, and essays based on the context of your entire conversation.',
          keyPoints: [
            'Built on Transformer neural network architecture with self-attention mechanisms',
            'Pre-trained on diverse web-scale textual corpora',
            'Fine-tuned with RLHF (Reinforcement Learning from Human Feedback)',
            'Processes text as numerical tokens rather than whole words',
          ],
        },
        Student: {
          quickAnswer: 'ChatGPT is an autoregressive decoder-only Transformer model optimized via Next-Token Prediction and aligned with Reinforcement Learning from Human Feedback (RLHF / PPO).',
          easyExplanation: 'At its core, ChatGPT calculates conditional probability distributions P(w_t | w_1, w_2, ..., w_{t-1}) over a vocabulary of ~100,000 token embeddings. It uses multi-head self-attention layers to assign dynamic relational weights between tokens regardless of distance in the context window. After unsupervised pre-training, Supervised Fine-Tuning (SFT) and reward-model-driven Proximal Policy Optimization (PPO) calibrate output alignment to human intent.',
          example: 'In vector space, semantic concepts like "King - Man + Woman = Queen" emerge organically as cosine similarity orientations between dense embedding vectors.',
          keyPoints: [
            'Decoder-only Transformer with causal masked self-attention',
            'Loss function: Cross-entropy across predicted next token distributions',
            'Alignment: SFT followed by Reward Model training and PPO/DPO optimization',
            'KV-caching optimizes autoregressive inference latency',
          ],
          formulasOrTips: [
            'Attention Equation: Attention(Q, K, V) = softmax((Q K^T) / √d_k) V',
            'Exam Tip: Contrast pre-training (unsupervised next-token loss) with RLHF (policy gradient optimization).',
          ],
        },
      },
      'Simple': {
        Kid: {
          quickAnswer: 'ChatGPT is an AI assistant that learned how humans talk by studying gigantic digital libraries!',
          easyExplanation: 'When you ask ChatGPT a question, it doesn\'t look things up like a Google search engine. Instead, its artificial brain remembers patterns from everything it read and writes an answer one word at a time, just for you!',
          example: 'Imagine building a giant LEGO castle: piece by piece, ChatGPT places each word down where it fits best.',
          keyPoints: [
            'Reads prompts and crafts brand new replies',
            'Trained on huge amounts of text',
            'Writes one word after another super fast',
          ],
        },
        Simple: {
          quickAnswer: 'ChatGPT is a computer program that understands and generates human-like text by predicting words in sequence.',
          easyExplanation: 'It uses machine learning to analyze the words in your question. Then it scans its internal memory of word patterns to produce sentences that make sense, answer questions, or solve problems.',
          example: 'Like an intelligent writing partner who has memorized every dictionary and reference guide.',
          keyPoints: [
            'Processes questions in natural language',
            'Generates clear step-by-step answers',
            'Continually aligns with human instructions',
          ],
        },
        Standard: {
          quickAnswer: 'ChatGPT is an AI chatbot that utilizes deep learning neural networks to process queries and output coherent natural language.',
          easyExplanation: 'It breaks your text down into tokens (word chunks) and passes them through dozens of neural layers. Each layer examines relationships between concepts using self-attention. The model then selects the most mathematically probable next tokens to answer your prompt clearly.',
          example: 'Chess grandmasters evaluate thousands of board patterns in seconds; ChatGPT evaluates billions of textual relationships to choose the best response.',
          keyPoints: [
            'Tokenization breaks sentences into sub-word units',
            'Self-attention identifies context across long sentences',
            'Tuned to avoid dangerous or misleading content',
          ],
        },
        Student: {
          quickAnswer: 'ChatGPT is an autoregressive generative language model that implements scaled dot-product attention to model semantic relationships across token sequences.',
          easyExplanation: 'The architecture passes token embeddings through multi-head self-attention and feed-forward networks with residual connections and layer normalization. Positional encodings provide sequence order. During generation, softmax temperature and top-p sampling control output determinism and creativity.',
          example: 'A temperature of 0.0 makes the model choose the single highest probability token every time (greedy decoding); temperature 0.8 introduces expressive diversity.',
          keyPoints: [
            'Multi-head attention projects queries, keys, and values into sub-spaces',
            'Sampling parameters: Temperature, Top-p (nucleus sampling), Top-k',
            'Safety guardrails: Moderation classifiers and constitution prompt filters',
          ],
          formulasOrTips: [
            'Softmax Probability: P(y_i) = exp(z_i / T) / ∑ exp(z_j / T)',
            'Study Note: Know how KV-cache avoids recalculating attention for preceding tokens during generation.',
          ],
        },
      },
      'Normal': {
        Kid: {
          quickAnswer: 'ChatGPT is a computer program that learned how human language works so it can talk and help you learn anything!',
          easyExplanation: 'Imagine an artist who practiced painting for thousands of hours. They can paint whatever picture you ask for! ChatGPT did the same thing, but with words instead of paint. It looked at billions of sentences written by humans. When you ask it something, it uses what it learned to paint a picture made of words!',
          example: 'Playing the game "finish my sentence" — you say "Once upon a..." and ChatGPT instantly says "time in a magical kingdom!"',
          keyPoints: [
            'Trained on enormous amounts of books and websites',
            'Can explain topics, translate languages, and write stories',
            'Uses clever computer math rather than human feelings',
            'Helps you understand hard questions in simple words',
          ],
        },
        Simple: {
          quickAnswer: 'ChatGPT is a powerful AI language model that interprets your questions and predicts the most relevant response.',
          easyExplanation: 'When you submit a prompt, ChatGPT converts your words into numerical representations called tokens. It maps these tokens through an artificial neural network containing hundreds of billions of connections. It then synthesizes a tailored answer by generating words that logically follow.',
          example: 'A GPS recalculates the best route from thousands of roads; ChatGPT recalculates the best response from billions of vocabulary combinations.',
          keyPoints: [
            'Converts words into numerical tokens',
            'Processes context through a neural network',
            'Generates responses word-by-word in real time',
            'Refined through human feedback to ensure helpfulness',
          ],
        },
        Standard: {
          quickAnswer: 'ChatGPT is an artificial intelligence model designed for natural conversation, text generation, and problem solving using deep learning transformer networks.',
          easyExplanation: 'Trained on vast text datasets, ChatGPT uses deep neural networks to comprehend nuanced conversational prompts. It analyzes the context of your input using self-attention mechanisms, allowing it to remember points made earlier in the dialogue and generate contextually appropriate, coherent replies.',
          example: 'An experienced translator who effortlessly grasps slang, humor, metaphors, and technical jargon in real time.',
          keyPoints: [
            'Employs Transformer architecture with self-attention',
            'Undergoes pre-training (unsupervised) and alignment (RLHF)',
            'Capable of code generation, creative writing, and data synthesis',
            'Maintains conversational context across multi-turn sessions',
          ],
        },
        Student: {
          quickAnswer: 'ChatGPT is an autoregressive Transformer language model trained on trillions of tokens via masked language modeling and fine-tuned using Direct Preference Optimization (DPO) and RLHF.',
          easyExplanation: 'The model architecture consists of stacked transformer decoder blocks with multi-head attention and feedforward layers with SwiGLU activations. During training, backpropagation minimizes cross-entropy loss between predicted logits and target tokens. Human preference alignments (RLHF with reward modeling or DPO) steer the model toward safety, truthfulness, and utility without causing catastrophic forgetting.',
          example: 'Attention matrices reveal that when the word "bank" appears near "river" and "water", attention weights connect to geographical definitions rather than financial ones.',
          keyPoints: [
            'Context window size dictates effective memory capacity (e.g., 32k to 128k+ tokens)',
            'Temperature and Top-P sampling modulate token distribution entropy',
            'Instruction tuning converts raw next-token predictor into an interactive assistant',
            'Hallucinations occur when statistical plausible patterns diverge from factual ground truth',
          ],
          formulasOrTips: [
            'Cross Entropy Loss: L = - ∑ y_true · log(P_pred)',
            'PPO Objective: L_CLIP(θ) = Ê_t [ min( r_t(θ) Â_t, clip(r_t(θ), 1-ε, 1+ε) Â_t ) ]',
          ],
        },
      },
      'Detailed': {
        Kid: {
          quickAnswer: 'ChatGPT is an artificial intelligence brain that turns questions into numbers, finds the smartest answers in its memory, and turns them back into friendly words!',
          easyExplanation: 'Computers don\'t understand letters like A, B, and C. So ChatGPT turns every word you type into secret computer numbers! Then, these numbers travel through billions of tiny digital math tunnels inside the computer. The tunnels connect ideas together — like linking "dogs" to "barking" and "wagging tails". At the end of the tunnels, the computer turns the numbers back into human words and prints them on your screen!',
          example: 'Like a giant pinball machine where your question is the ball, bumping through thousands of bumpers until it lands in the winning jackpot bucket!',
          keyPoints: [
            'Converts words into numbers called tokens',
            'Uses billions of math connections to think',
            'Translates math answers back into human sentences',
            'Never gets tired of answering questions!',
          ],
        },
        Simple: {
          quickAnswer: 'ChatGPT operates through a Transformer neural network that analyzes context and determines the statistical sequence of words to reply.',
          easyExplanation: 'The core technology is called the Transformer. Unlike older AI systems that analyzed words one-by-one from left to right, Transformers analyze all words in a sentence simultaneously. This allows ChatGPT to grasp complex relationships, pronouns, and intent across entire paragraphs before choosing the first word of its answer.',
          example: 'Reading a mystery novel while remembering clues from page one, so the surprise ending on page three hundred makes total sense.',
          keyPoints: [
            'Analyzes all words simultaneously via parallel computing',
            'Self-attention identifies links between distant words in a paragraph',
            'Generates coherent paragraphs that stay on topic',
            'Constantly improved to decrease factual mistakes',
          ],
        },
        Standard: {
          quickAnswer: 'ChatGPT is an enterprise-scale conversational AI built upon self-attention mechanisms, trained on massive web corpora and aligned via human reinforcement learning.',
          easyExplanation: 'The Transformer network converts inputs into high-dimensional vector spaces. Through successive multi-head attention layers, it recalculates contextual embeddings based on relative distances and syntactic roles. After foundation training captures language syntax and semantic knowledge, reinforcement learning with reward models enforces conversational guardrails, citation etiquette, and instructional adherence.',
          example: 'Vector arithmetic in semantic space: The vector difference between "Paris" and "France" is almost identical to the vector difference between "Tokyo" and "Japan".',
          keyPoints: [
            'Embeddings represent words as points in high-dimensional vector spaces (e.g., 4096 dimensions)',
            'Self-attention layers dynamically compute attention maps between all tokens',
            'Residual connections prevent vanishing gradients in deep 96+ layer networks',
            'Fine-tuning aligns probabilistic token generation with human truthfulness standards',
          ],
        },
        Student: {
          quickAnswer: 'ChatGPT is a dense causal decoder Transformer trained on web-scale token sequences using cross-entropy next-token loss, followed by instruction tuning and policy gradient optimization (RLHF/DPO).',
          easyExplanation: 'Input text undergoes Byte-Pair Encoding (BPE) tokenization. Embedded tokens receive learned or rotary positional embeddings (RoPE). In each decoder block, masked multi-head attention computes Query, Key, and Value matrices. Softmax normalizes QK^T / √d_k into an attention score distribution, which weights the Value vectors. Feedforward networks apply non-linear projections (such as SwiGLU). Layer normalization (RMSNorm) and residual stream summation preserve gradient flow during backpropagation across hundreds of billions of parameters.',
          example: 'FlashAttention reformulates the exact softmax attention calculation using GPU SRAM tiling to reduce memory IO from O(N²) to linear O(N) relative to sequence length.',
          keyPoints: [
            'Byte-Pair Encoding (BPE) handles vocabulary tokenization and out-of-vocabulary words',
            'Rotary Positional Embeddings (RoPE) encode relative token positions in attention space',
            'RMSNorm and SwiGLU activation functions accelerate transformer convergence',
            'Inference relies on KV caching to avoid quadratic compute on previously generated tokens',
          ],
          formulasOrTips: [
            'RoPE Formula: R_Θ,m^d x_m applies 2D rotation matrices to orthogonal pairs of coordinates.',
            'Attention Complexity: O(N² d) compute and memory without sparse or flash attention optimizations.',
          ],
        },
      },
      'Advanced': {
        Kid: {
          quickAnswer: 'ChatGPT is a massive mathematical brain made of billions of digital puzzles that work together to understand any question you can dream up!',
          easyExplanation: 'Inside a giant computer warehouse, billions of numbers talk to each other in milliseconds. When you ask a question, ChatGPT looks at the words like clues in a treasure hunt. It connects your question to all the world\'s knowledge and builds an answer that is easy, fun, and exciting to read!',
          example: 'A symphony orchestra with hundreds of musicians: when the conductor waves their baton, every instrument plays together in perfect harmony.',
          keyPoints: [
            'Billions of math calculations happen in seconds',
            'Connects facts from science, history, and art',
            'Speaks in any language and style you choose',
          ],
        },
        Simple: {
          quickAnswer: 'ChatGPT is a deep neural network system engineered with Transformer blocks that compute statistical predictions across vast token vocabularies.',
          easyExplanation: 'By transforming text into numerical matrices and applying layers of linear algebra and non-linear activation functions, ChatGPT captures the structure of human language. Its training on massive compute clusters enables it to generalize across tasks ranging from creative writing to programming without task-specific retraining.',
          example: 'A supercomputer simulator that can simulate weather, finance, or chess simply by reading text prompts.',
          keyPoints: [
            'Zero-shot and few-shot learning capabilities',
            'Trained on thousands of GPUs using distributed parallelism',
            'Executes matrix multiplications at teraflop speeds',
          ],
        },
        Standard: {
          quickAnswer: 'ChatGPT represents the convergence of deep autoregressive Transformers, distributed tensor parallelism, and human-in-the-loop preference optimization.',
          easyExplanation: 'The model architecture processes inputs through causal attention blocks where future tokens are strictly masked. During inferencing, logits over the vocabulary are adjusted by temperature scaling and nucleus sampling algorithms. System alignment employs Constitutional AI and DPO to suppress toxic outputs, minimize sycophancy, and maintain consistent agent persona across multi-turn exchanges.',
          example: 'Beam search versus nucleus sampling: Beam search finds the highest global probability path (often repetitive), while Top-p sampling maintains natural human-like cadence.',
          keyPoints: [
            'Causal masking prevents the model from attending to subsequent tokens during training',
            'Nucleus (Top-p) sampling filters out the tail of low-probability tokens dynamically',
            'Constitutional AI principles guide automated critique and revision pipelines',
            'Quantization (FP8, INT4) enables deployment across modern inference hardware',
          ],
        },
        Student: {
          quickAnswer: 'ChatGPT is a large-scale autoregressive Transformer parameterizing P_θ(x) = ∏ P_θ(x_i | x_{<i}), trained via self-supervised cross-entropy minimization and aligned through constrained policy optimization.',
          easyExplanation: 'The training paradigm proceeds from unsupervised pretraining on web corpora to supervised fine-tuning (SFT) on curated instruction-response pairs, followed by reinforcement learning from human feedback (RLHF) or Direct Preference Optimization (DPO). In RLHF, a Bradley-Terry reward model r_ψ(x, y) is trained on pairwise human comparisons. The policy π_θ is optimized via Proximal Policy Optimization (PPO) against the reward objective with a Kullback-Leibler (KL) divergence penalty: max_θ E [ r_ψ(x, y) - β D_KL(π_θ(y|x) || π_ref(y|x)) ] to prevent policy collapse.',
          example: 'DPO replaces explicit reward modeling by expressing the optimal reward analytically as r(x, y) = β log(π_θ(y|x) / π_ref(y|x)) + β log Z(x), optimizing the policy directly with binary cross-entropy loss over preferences.',
          keyPoints: [
            'Bradley-Terry preference model: P(y_w ≻ y_l | x) = σ(r(x, y_w) - r(x, y_l))',
            'KL divergence penalty enforces policy regularization against the reference model π_ref',
            'Direct Preference Optimization (DPO) eliminates the auxiliary reward model and PPO instability',
            'Speculative decoding leverages a smaller draft model to verify multiple tokens in parallel, achieving 2–3x latency reduction',
          ],
          formulasOrTips: [
            'DPO Objective: L_DPO(π_θ; π_ref) = - E_(x, y_w, y_l) [ log σ( β log(π_θ(y_w|x)/π_ref(y_w|x)) - β log(π_θ(y_l|x)/π_ref(y_l|x)) ) ]',
            'Interview Topic: Contrast latency, memory, and stability trade-offs between PPO and DPO in LLM alignment.',
          ],
        },
      },
    },
    quizzes: [
      {
        id: 'ai-q1',
        question: 'What is the core technology underlying ChatGPT?',
        options: ['Relational Database', 'Transformer Neural Network', 'Quantum Processor', 'Decision Tree Classifier'],
        correctIndex: 1,
        explanation: 'ChatGPT is built upon the Transformer neural network architecture introduced in 2017.',
      },
      {
        id: 'ai-q2',
        question: 'What does RLHF stand for in AI training?',
        options: [
          'Reinforcement Learning from Human Feedback',
          'Recursive Language Hyper-Fast',
          'Real-time Logic Hardware Framework',
          'Random Layer Heuristic Filtering',
        ],
        correctIndex: 0,
        explanation: 'Reinforcement Learning from Human Feedback trains the AI to produce helpful, polite, and safe responses.',
      },
      {
        id: 'ai-q3',
        question: 'How does ChatGPT determine what words to write?',
        options: [
          'It searches Google live for every single word',
          'It predicts the most probable next token based on context',
          'A human operator types answers behind the scenes',
          'It picks random words from an encyclopedia',
        ],
        correctIndex: 1,
        explanation: 'ChatGPT calculates probabilities for which token (word piece) makes the most sense to follow the preceding text.',
      },
    ],
  },
};

/**
 * Generates an answer dynamically for ANY question
 */
export function generateDynamicExplanation(
  question: string,
  level: UnderstandingLevel,
  mode: ExplanationMode
): StructuredAnswer {
  const normalized = question.trim().toLowerCase();

  // Check if matches known knowledge base
  for (const [key, topic] of Object.entries(KNOWLEDGE_BASE)) {
    if (topic.keywords.some((kw) => normalized.includes(kw))) {
      const variant = topic.variants[level]?.[mode] || topic.variants['Normal']['Standard'];
      return {
        id: `ans-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        question,
        level,
        mode,
        timestamp: Date.now(),
        quickAnswer: variant.quickAnswer,
        easyExplanation: variant.easyExplanation,
        example: variant.example,
        keyPoints: variant.keyPoints,
        formulasOrTips: variant.formulasOrTips,
        tags: topic.tags,
        category: topic.category,
      };
    }
  }

  // Synthesize dynamic answer for general queries tailored to Level & Mode
  const levelDescriptors: Record<UnderstandingLevel, { tone: string; complexity: string; analogy: string }> = {
    'Very Simple': {
      tone: 'ultra-friendly and simple, like explaining to a 6-year-old',
      complexity: 'everyday words with zero jargon',
      analogy: 'a fun toy, playground game, or cute pet',
    },
    'Simple': {
      tone: 'clear and conversational',
      complexity: 'short sentences and plain vocabulary',
      analogy: 'a familiar household routine or common tool',
    },
    'Normal': {
      tone: 'balanced, modern, and engaging',
      complexity: 'practical clarity with accurate concepts',
      analogy: 'an everyday real-world system like driving, cooking, or sports',
    },
    'Detailed': {
      tone: 'thorough, analytical, and structured',
      complexity: 'step-by-step mechanisms and precise terminology',
      analogy: 'an industrial process, engineering diagram, or scientific workflow',
    },
    'Advanced': {
      tone: 'rigorous, comprehensive, and academic',
      complexity: 'underlying principles, quantitative logic, and domain theories',
      analogy: 'a formal laboratory model or mathematical framework',
    },
  };

  const modeFeatures: Record<ExplanationMode, { focus: string; style: string }> = {
    Kid: {
      focus: 'safe, cheerful, and wonder-filled insights',
      style: 'Use fun emojis, relatable stories, and zero scary ideas.',
    },
    Student: {
      focus: 'academic curriculum clarity, exam readiness, and key definitions',
      style: 'Structure with textbook precision, memory aids, and study tips.',
    },
    Standard: {
      focus: 'well-rounded, intuitive understanding for curious minds',
      style: 'Provide thoughtful nuance, practical significance, and balanced context.',
    },
    Simple: {
      focus: 'quick-reading bullet points and short sentences',
      style: 'Keep sentences concise, direct, and easy for beginners or ESL readers.',
    },
  };

  const cfg = levelDescriptors[level];
  const mf = modeFeatures[mode];

  // Derive topic title
  const cleanQ = question.replace(/^(what is|how does|why is|explain|tell me about)\s+/i, '').replace(/\?+$/, '');
  const subject = cleanQ.length > 0 ? cleanQ : 'this concept';

  return {
    id: `ans-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    question,
    level,
    mode,
    timestamp: Date.now(),
    quickAnswer: `In ${level.toLowerCase()} terms for ${mode.toLowerCase()} mode: ${subject} is fundamentally about how specific forces, rules, and components interact to create observable results.`,
    easyExplanation: `To understand ${subject}, let's look at it step-by-step with ${cfg.complexity}. ${mf.style} At its core, everything starts with an initial cause or condition. When energy, data, or materials are introduced, they follow predictable laws of nature and logic. This transforms the input into the final outcome we see today.`,
    example: `Think of ${subject} like ${cfg.analogy}. When you interact with the primary component, the reaction ripples through the remaining parts just like dominoes falling in a planned pattern.`,
    keyPoints: [
      `Foundational principle: ${subject} relies on clear cause-and-effect rules.`,
      `Mechanics: Inputs are processed systematically according to proven principles.`,
      `Practical takeaway: Understanding ${subject} allows you to predict how similar systems behave in everyday life.`,
      `Insight: Changing the complexity to "${level}" highlights the most crucial relationships without unnecessary confusion.`,
    ],
    formulasOrTips:
      mode === 'Student'
        ? [
            `Core Concept: Analyze ${subject} through the lens of Conservation Laws & First Principles.`,
            `Exam Tip: State the definition clearly first, provide a concrete example, and summarize the primary mechanism in 2 sentences.`,
          ]
        : undefined,
    tags: ['education', 'concept', 'explainer'],
    category: 'General Knowledge',
  };
}

/**
 * Generate 3-question interactive quiz dynamically
 */
export function generateQuizForAnswer(answer: StructuredAnswer): QuizItem[] {
  // Check if KB quiz exists
  const normalized = answer.question.toLowerCase();
  for (const [_, topic] of Object.entries(KNOWLEDGE_BASE)) {
    if (topic.keywords.some((kw) => normalized.includes(kw))) {
      return topic.quizzes;
    }
  }

  // Generate customized quiz items based on answer content
  return [
    {
      id: `quiz-1-${Date.now()}`,
      question: `What is the core takeaway regarding "${answer.question.replace(/\?$/, '')}"?`,
      options: [
        answer.quickAnswer.slice(0, 75) + '...',
        'It occurs completely randomly without any physical or logical rules.',
        'It only works inside a laboratory and cannot happen in nature.',
        'It was proven false by modern science last year.',
      ],
      correctIndex: 0,
      explanation: `Correct! ${answer.quickAnswer}`,
    },
    {
      id: `quiz-2-${Date.now()}`,
      question: 'Which of the following best describes the example used in this explanation?',
      options: [
        'An example was never provided in the explanation.',
        answer.example.slice(0, 80) + '...',
        'Comparing it to eating a slice of pizza on the moon.',
        'Running backwards on a speeding train.',
      ],
      correctIndex: 1,
      explanation: `Right! The explanation compared this concept directly: ${answer.example}`,
    },
    {
      id: `quiz-3-${Date.now()}`,
      question: `Why is this explanation tuned to the "${answer.level}" level?`,
      options: [
        'To randomly change words without changing meaning.',
        `To tailor the vocabulary, depth, and analogies specifically to ${answer.level.toLowerCase()} understanding.`,
        'Because AI cannot write in any other level.',
        'To test your internet connection speed.',
      ],
      correctIndex: 1,
      explanation: `Exactly! ExplainIt AI adapts explanation complexity so anyone can understand any concept at their ideal knowledge level.`,
    },
  ];
}

/**
 * Generate a new custom Learning Path from a topic name and sub-topics
 */
export function createCustomLearningPath(
  broadTopic: string,
  subTopics: string[]
): LearningPath {
  const complexitySequence: UnderstandingLevel[] = [
    'Very Simple',
    'Simple',
    'Normal',
    'Detailed',
    'Advanced',
  ];

  const concepts: LearningConcept[] = subTopics.map((sub, idx) => {
    const complexity = complexitySequence[Math.min(idx, complexitySequence.length - 1)];
    return {
      id: `concept-${Date.now()}-${idx}`,
      title: sub,
      description: `Understand the fundamental concepts, mechanisms, and real-world impact of ${sub}.`,
      complexity,
      suggestedQuestion: `Can you explain ${sub} at a ${complexity} level in simple, memorable terms?`,
      subTopic: sub,
      status: idx === 0 ? 'in_progress' : 'not_started',
      order: idx + 1,
    };
  });

  return {
    id: `path-${Date.now()}`,
    broadTopic,
    description: `A personalized learning sequence exploring ${broadTopic} step-by-step from foundations to mastery.`,
    icon: 'Compass',
    color: 'from-blue-600 to-indigo-600',
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    concepts,
  };
}
