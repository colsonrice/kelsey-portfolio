/**
 * Kelsey Rice Portfolio - Interactive JavaScript
 * Features: Navigation, Animations, Chat Widget with AI-like responses
 */

// ================================
// DOM Elements
// ================================
const header = document.querySelector('.header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const chatToggle = document.getElementById('chat-toggle');
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatClose = document.getElementById('chat-close');
const caseStudyToggles = document.querySelectorAll('.case-study-toggle');
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

// ================================
// Kelsey's Complete Knowledge Base
// Based on Resume, LinkedIn, and Website
// ================================
const kelseyKnowledge = [
    {
        name: 'currentRole',
        patterns: [
            /current|now|today|present|role|job|position|director|what do you do|doing now|work\s*at/i
        ],
        response: "I'm currently the Director of SEO at SingleCare (DTC) / RxSense (B2B), a position I've held since April 2022. I've been with SingleCare for over 6 years total, working my way up from SEO Specialist to Senior SEO Manager to Director. In this role, I've built and scaled the SEO program driving a 12x increase in organic revenue, adapted our search strategy through AI-driven search disruption, and I plan the content roadmap based on performance data and competitive analysis."
    },
    {
        name: 'experience',
        patterns: [
            /experience|background|work history|career|worked|employment|years|how long|journey|path/i
        ],
        response: "I have nearly 10 years of experience in SEO and content marketing, with the last 6+ years focused on healthtech at SingleCare/RxSense. My career path includes:\n\n• Director of SEO at SingleCare (2022-Present)\n• Sr. SEO Manager at SingleCare (2020-2022)\n• SEO Specialist at SingleCare (2019-2020)\n• Reviews Editor at Three Ships (2018-2019)\n• Content Marketing roles at Houzz (2016-2018)\n• Campus Editor at LinkedIn (2015-2016)\n\nI've consistently delivered results, including driving 25x organic growth and 12x increase in organic revenue."
    },
    {
        name: 'singlecare',
        patterns: [
            /singlecare|rxsense|pharmacy|prescription|healthcare|health\s*tech|healthtech|medicine|drug/i
        ],
        response: "At SingleCare/RxSense, I've spent over 6 years building and scaling the SEO program. Key accomplishments:\n\n• As Director: Drove 12x increase in organic revenue, adapted strategy for AI-driven search\n• As Sr. Manager: Achieved 25x organic growth, launched Spanish pharmacy directory\n• As Specialist: Built API-driven content system saving thousands of editing hours\n\nSingleCare helps people save on prescription medications, and I'm proud to work on a product that genuinely helps people afford their healthcare."
    },
    {
        name: 'threeShips',
        patterns: [
            /three ships|reviews editor|affiliate/i
        ],
        response: "At Three Ships (2018-2019), I worked as a Reviews Editor in Raleigh-Durham, North Carolina. I launched a new business line as the end-to-end owner of the home products/services affiliate hub. This experience taught me valuable lessons about content monetization and building editorial systems from scratch."
    },
    {
        name: 'houzz',
        patterns: [
            /houzz|home improvement|palo alto/i
        ],
        response: "I spent 2 years at Houzz in Palo Alto, California (2016-2018):\n\n• As Content Marketing Specialist: Optimized content for new site features and wrote/updated product guides\n• As Production Coordinator: Scaled the content partnerships program to 3x its original size\n\nThis is where I really developed my skills in scaling content operations and working cross-functionally with product and engineering teams."
    },
    {
        name: 'skills',
        patterns: [
            /skills|abilities|expertise|good at|specialize|capable|strengths|what can you do/i
        ],
        response: "My core skills include:\n\n• SEO strategy & roadmapping\n• Project management & sprint planning\n• Data analysis & reporting\n• Technical SEO optimization\n• Team leadership & mentorship\n• Cross-functional collaboration\n• Content optimization, writing & editing\n• Keyword research & competitive analysis\n\nI combine data-driven insights with editorial excellence to create content strategies that deliver measurable results."
    },
    {
        name: 'tools',
        patterns: [
            /tools|software|platforms|ahrefs|semrush|analytics|google|tech stack|use/i
        ],
        response: "I work with a comprehensive SEO and analytics toolkit:\n\n• Keyword Research: Ahrefs, SEMrush\n• Analytics: GA4, Google Search Console\n• Reporting: Looker Studio, Tableau\n• Technical SEO: Screaming Frog, Jet Octopus\n• Various CMS platforms\n• API-driven content systems\n\nI'm always learning new tools and staying current with the evolving SEO landscape."
    },
    {
        name: 'aiProjects',
        patterns: [
            /ai|llm|artificial intelligence|chatgpt|machine learning|geo|generative|ai project/i
        ],
        response: "I've been at the forefront of adapting SEO for the AI era! My GEO/LLM projects include:\n\n• Technical SEO optimizations for non-JS content rendering → 32% improvement in AI referral traffic\n• Discoverability grew by 733 landing pages\n• Launched new site directory for GEO experimentation\n• Leveraged LLMs to scale key takeaways across 1K+ articles, saving hundreds of manual editing hours\n\nI'm actively mentoring my team through AI-driven search disruption."
    },
    {
        name: 'education',
        patterns: [
            /education|degree|school|university|studied|college|indiana|stanford|learn/i
        ],
        response: "My educational background:\n\n• B.A. in Journalism with concentration in Informatics - Indiana University Bloomington (2012-2016)\n• Certificate in Informatics & UX Design\n• Specialized in enterprise journalism and interactive/digital media\n• Creative Writing coursework at Stanford University (2018)"
    },
    {
        name: 'results',
        patterns: [
            /results|achievements|accomplishments|success|impact|metrics|numbers|growth|outcome|deliver/i
        ],
        response: "Here are some of my key achievements:\n\n• 12x increase in organic revenue at SingleCare\n• 25x organic growth over three years\n• 32% improvement in AI referral traffic\n• 733 new landing pages for discoverability\n• 18.6% conversion rate on highest-performing page type\n• Scaled content partnerships 3x at Houzz\n• Built API-driven content system saving thousands of hours annually\n\nI focus on measurable outcomes that tie directly to business goals."
    },
    {
        name: 'content',
        patterns: [
            /content|editorial|writing|copywriting|articles|blog|strategy/i
        ],
        response: "I'm a trained journalist with an eye for design who takes a product-led approach to content strategy. My content philosophy:\n\n• Keep both humans and algorithms in mind\n• Bridge editorial excellence with commercial goals\n• Create scalable frameworks for consistency\n• Focus on user intent, not just keywords\n\nOne of my proudest achievements is developing page types that bridge editorial and commercial content with an 18.6% conversion rate!"
    },
    {
        name: 'international',
        patterns: [
            /international|global|spanish|localization|markets|expansion|language|spanish/i
        ],
        response: "I managed the full product development of SingleCare's Spanish site and pharmacy directory from research to release. This involved:\n\n• Coordinating across product, engineering, and localization teams\n• Developing culturally resonant content\n• Maintaining SEO best practices across languages\n• Successfully launching in Spanish-speaking markets\n\nOur content now ranks competitively against established local players."
    },
    {
        name: 'leadership',
        patterns: [
            /leadership|team|manage|mentor|lead|report/i
        ],
        response: "As Director of SEO, I lead and mentor the search team through significant industry changes including AI-driven search disruption. My leadership approach:\n\n• Cross-functional collaboration with product, design, and engineering\n• Data-driven decision making\n• Mentoring team members through industry shifts\n• Building scalable processes and frameworks\n\nI believe in empowering my team while maintaining accountability for results."
    },
    {
        name: 'dataJournalism',
        patterns: [
            /data journalism|research|data story|backlinks|link building|links/i
        ],
        response: "My journalism background gives me a unique edge in creating data-driven content that earns links naturally. I've built backlink flywheels using:\n\n• Original research and surveys\n• Data analysis and visualization\n• Stories that journalists want to cite\n\nThis establishes a sustainable link-earning engine that builds domain authority without relying solely on outreach campaigns."
    },
    {
        name: 'contact',
        patterns: [
            /contact|reach|email|phone|hire|work together|collaborate|connect|get in touch|talk/i
        ],
        response: "I'd love to connect! Here's how to reach me:\n\n📧 Email: kels.seo4good@gmail.com\n📱 Phone: (219) 742-9898\n📍 Location: Zionsville, Indiana\n💼 LinkedIn: linkedin.com/in/kelsrice\n\nFeel free to reach out about SEO strategy, content marketing, or potential collaborations!"
    },
    {
        name: 'location',
        patterns: [
            /location|where|based|live|zionsville|indiana|remote/i
        ],
        response: "I'm based in Zionsville, Indiana (just outside Indianapolis). I've also lived and worked in:\n\n• Palo Alto, California (at Houzz)\n• Raleigh-Durham, North Carolina (at Three Ships)\n\nI work effectively with remote teams and have experience collaborating across time zones."
    },
    {
        name: 'volunteering',
        patterns: [
            /volunteer|charity|nonprofit|give back|community|furnishing|front row|cause/i
        ],
        response: "I believe in giving back! My volunteer work includes:\n\n• Furnishing For Hope (since 2016): We furnish homes for families in need, making each house feel like a real home. I even partnered with Houzz to support this mission!\n\n• Front Row Foundation (since 2014): Supporting those facing life-threatening illnesses\n\nThese organizations are close to my heart."
    },
    {
        name: 'approach',
        patterns: [
            /approach|methodology|process|philosophy|how do you work|style/i
        ],
        response: "My approach to SEO and content:\n\n• Product-led strategy - SEO integrated into product development\n• Human + algorithm balance - content for people, optimized for search\n• Cross-functional collaboration - working with product, design, engineering\n• Data-informed decisions - letting metrics guide strategy\n• User experience focus - not just rankings, but conversions\n\nMy goal: create digital experiences that are easy to find AND better to use."
    },
    {
        name: 'whoIs',
        patterns: [
            /who is|who are you|tell me about|introduce|about kelsey|yourself/i
        ],
        response: "I'm Kelsey Rice - an SEO expert, data-driven content strategist, and trained journalist with an eye for design.\n\nCurrently, I'm the Director of SEO at SingleCare/RxSense, where I've driven 12x organic revenue growth. With nearly 10 years of experience, I take a product-led approach to search strategy, keeping both humans and algorithms in mind.\n\nI'm passionate about creating digital experiences that are easy to find and better to use!"
    },
    {
        name: 'chooseAdventure',
        patterns: [
            /choose your adventure|choose.*adventure/i
        ],
        response: "You can ask me about:\nA) My sweet little family\nB) What I'd do if SEO didn't exist\nC) My current playlist\nPick a letter. 🙂"
    },
    {
        name: 'adventureA',
        patterns: [
            /^a[).\s]?$/i,
            /^a\b/i,
            /family|married|kids|kiddos|perry|dean|colson/i
        ],
        response: "I'm married to a creative genius, Colson, and we have two kiddos: Perry (3.5 y/o) and Dean (almost 2)."
    },
    {
        name: 'adventureB',
        patterns: [
            /^b[).\s]?$/i,
            /if seo didn|art teacher|didn.*exist/i
        ],
        response: "If SEO wasn't my full-time gig, I'd love to be an art teacher!"
    },
    {
        name: 'adventureC',
        patterns: [
            /^c[).\s]?$/i,
            /playlist|music|listening|favorite.*artist|olivia dean|creed|nickelback/i
        ],
        response: "My favorite new artist is Olivia Dean, but I'm a faithful fan of Creed and Nickelback."
    },
    {
        name: 'greeting',
        patterns: [
            /^(hello|hi|hey|greetings|good morning|good afternoon|good evening|howdy|sup|yo)$/i,
            /^(hello|hi|hey)[\s!.,]*$/i
        ],
        response: "Hey there! 👋 I'm Kelsey's AI assistant. I can tell you about her 10 years of SEO experience, her role as Director of SEO at SingleCare, her skills and achievements, or how to get in touch. What would you like to know?"
    },
    {
        name: 'thanks',
        patterns: [
            /thank|thanks|appreciate|helpful|great|awesome|perfect/i
        ],
        response: "You're welcome! Is there anything else you'd like to know about Kelsey's experience, skills, or how to connect with her? Feel free to ask!"
    },
    {
        name: 'why',
        patterns: [
            /why seo|why content|passion|love|enjoy|motivation/i
        ],
        response: "I'm passionate about SEO because it sits at the intersection of creativity and data. There's something deeply satisfying about:\n\n• Helping people find exactly what they need\n• Seeing content strategy translate into real business results\n• Solving the puzzle of search algorithms\n• Working at SingleCare where our work helps people afford healthcare\n\nI love that SEO lets me use both my journalism background and my analytical side!"
    }
];

// ================================
// Navigation Functions
// ================================
function initNavigation() {
    // Mobile menu toggle
    mobileMenuToggle?.addEventListener('click', () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close mobile menu on link click
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.background = 'rgba(15, 15, 26, 0.95)';
        } else {
            header.style.background = 'rgba(15, 15, 26, 0.8)';
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================================
// Chat Widget Functions
// ================================
function initChat() {
    if (!chatToggle || !chatContainer) return;

    // Toggle chat open/close
    chatToggle.addEventListener('click', toggleChat);

    // Close button
    chatClose?.addEventListener('click', closeChat);

    // Handle chat form submission
    chatForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();

        if (message) {
            sendMessage(message);
        }
    });

    // Handle quick reply buttons
    chatMessages?.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-reply')) {
            e.stopPropagation();
            const message = e.target.dataset.message;
            if (message) {
                sendMessage(message);
            }
        }
    });

    // Close chat when clicking outside (but not on quick replies)
    document.addEventListener('click', (e) => {
        // Don't close if clicking quick reply buttons
        if (e.target.classList.contains('quick-reply')) {
            return;
        }
        if (chatToggle.getAttribute('aria-expanded') === 'true' &&
            !chatContainer.contains(e.target) &&
            !chatToggle.contains(e.target)) {
            closeChat();
        }
    });
}

function sendMessage(message) {
    // Hide quick replies after first interaction
    const quickReplies = chatMessages.querySelector('.quick-replies');
    if (quickReplies) {
        quickReplies.remove();
    }

    addMessage(message, 'user');
    chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI response delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateResponse(message);
        streamMessage(response, 'bot');
    }, 400 + Math.random() * 400);
}

function showFollowUpReplies() {
    const existingReplies = chatMessages.querySelector('.quick-replies');
    if (existingReplies) {
        existingReplies.remove();
    }

    const quickReplies = document.createElement('div');
    quickReplies.className = 'quick-replies';
    quickReplies.innerHTML = `
        <button class="quick-reply" data-message="Tell me about your results">Results</button>
        <button class="quick-reply" data-message="What's your education?">Education</button>
        <button class="quick-reply" data-message="How can I contact you?">Contact</button>
    `;
    chatMessages.appendChild(quickReplies);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function toggleChat() {
    const isExpanded = chatToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
        closeChat();
    } else {
        openChat();
    }
}

function openChat() {
    chatToggle.setAttribute('aria-expanded', 'true');
    chatContainer.removeAttribute('hidden');
    chatContainer.classList.add('open');
    chatInput?.focus();
}

function closeChat() {
    chatToggle.setAttribute('aria-expanded', 'false');
    chatContainer.classList.remove('open');
    setTimeout(() => {
        chatContainer.setAttribute('hidden', '');
    }, 300);
}

function addMessage(text, sender) {
    // Remove any existing quick replies before adding new message
    const existingReplies = chatMessages.querySelector('.quick-replies');
    if (existingReplies && sender === 'user') {
        existingReplies.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;

    // Convert newlines to <br> for formatting
    const formattedText = text.replace(/\n/g, '<br>');
    messageDiv.innerHTML = `<p>${formattedText}</p>`;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function streamMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    const p = document.createElement('p');
    messageDiv.appendChild(p);
    chatMessages.appendChild(messageDiv);

    // Convert text to array of characters, preserving newlines as <br>
    const formattedText = text.replace(/\n/g, '§BR§');
    const chars = formattedText.split('');

    let index = 0;
    let currentText = '';
    const speed = 12; // milliseconds per character

    function typeChar() {
        if (index < chars.length) {
            // Check for BR marker
            if (chars[index] === '§' && formattedText.substring(index, index + 4) === '§BR§') {
                currentText += '<br>';
                index += 4;
            } else {
                currentText += chars[index];
                index++;
            }

            p.innerHTML = currentText + '<span class="cursor">|</span>';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Vary speed slightly for more natural feel
            const variance = Math.random() * 10 - 5;
            setTimeout(typeChar, speed + variance);
        } else {
            // Done streaming - remove cursor and show quick replies
            p.innerHTML = currentText;
            showFollowUpReplies();
        }
    }

    typeChar();
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    indicator?.remove();
}

function generateResponse(message) {
    const lowerMessage = message.toLowerCase().trim();

    // Check each knowledge category using regex patterns
    for (const item of kelseyKnowledge) {
        for (const pattern of item.patterns) {
            if (pattern.test(message) || pattern.test(lowerMessage)) {
                return item.response;
            }
        }
    }

    // Fallback: try simple keyword matching
    const keywords = lowerMessage.split(/\s+/);
    for (const item of kelseyKnowledge) {
        const responseWords = item.name.toLowerCase();
        if (keywords.some(word => responseWords.includes(word) || word.includes(responseWords))) {
            return item.response;
        }
    }

    // Default response
    return "Great question! I might not have the specific answer, but I can tell you that Kelsey is a Director of SEO with nearly 10 years of experience, specializing in healthtech. She's driven 12x organic revenue growth and 25x organic traffic growth at SingleCare.\n\nTry asking about her experience, skills, tools, AI projects, or how to contact her!";
}

// ================================
// Case Study Toggles
// ================================
function initCaseStudies() {
    caseStudyToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const caseStudy = toggle.closest('.case-study');
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

            toggle.setAttribute('aria-expanded', !isExpanded);
            caseStudy.classList.toggle('expanded');

            // Update button text
            const span = toggle.querySelector('span');
            if (span) {
                span.textContent = isExpanded ? 'View Details' : 'Details';
            }
        });
    });
}

// ================================
// Animated Counter
// ================================
function initCounters() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.count);
    const duration = 2000;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out-quart)
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const current = target * easeProgress;

        element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = isDecimal ? target.toFixed(1) : target;
        }
    }

    requestAnimationFrame(update);
}

// ================================
// Scroll Animations (AOS-like)
// ================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay if specified
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
}

// ================================
// Parallax Effects
// ================================
function initParallax() {
    const heroBlob = document.querySelector('.hero-blob');

    if (heroBlob) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroBlob.style.transform = `translateY(${rate}px)`;
        });
    }
}

// ================================
// Form Validation (if needed)
// ================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

// ================================
// Keyboard Navigation
// ================================
function initKeyboardNav() {
    // Close chat with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (chatToggle?.getAttribute('aria-expanded') === 'true') {
                closeChat();
            }
            if (navLinks?.classList.contains('active')) {
                mobileMenuToggle?.click();
            }
        }
    });
}

// ================================
// Performance: Lazy Load Images
// ================================
function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Fallback with Intersection Observer
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ================================
// Initialize Everything
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initChat();
    initCaseStudies();
    initCounters();
    initScrollAnimations();
    initParallax();
    initFormValidation();
    initKeyboardNav();
    initLazyLoad();

    // Log initialization
    console.log('Kelsey Rice Portfolio initialized');
});

// ================================
// Handle page visibility for animations
// ================================
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Resume animations when page becomes visible
        document.querySelectorAll('[data-aos]').forEach(el => {
            if (el.classList.contains('aos-animate')) {
                el.style.animationPlayState = 'running';
            }
        });
    }
});
