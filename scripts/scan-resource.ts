import { AddressType, Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import fs from 'fs'
import { v4 } from 'uuid'
import { promisify } from 'util'
import { PromptTemplate } from 'langchain/prompts'
import { OpenAI } from 'langchain/llms/openai'
import { TokenTextSplitter } from 'langchain/text_splitter'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'
import readline from 'readline'
import { createReadStream, createWriteStream, unlinkSync } from 'fs'
import { paramCase } from 'change-case'
;(globalThis as any).fetch = fetch

puppeteer.use(StealthPlugin())

import languages from '../languages.json'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const googleMapsClient = new GoogleMapsClient({})

// Promisify fs methods for async/await usage
const writeFile = promisify(fs.writeFile)

const INPUT_DIR = path.join(__dirname, '../pre-resources')

const defaultSet: {
  [key: string]: {
    i18n: {
      [key: string]: {
        title: string
        description: string
      }
    }
    slug: string
    tags: string[]
    organizationType: string[]
  }
} = {
  'mainefamilyplanning.org': {
    i18n: {
      'en-US': {
        title: 'Maine Family Planning',
        description:
          'Maine Family Planning provides affordable reproductive health care services for all Mainers, as well as primary care, help for new parents and families, and gender-affirming health services. Some services are available online.',
      },
    },
    slug: 'maine-family-planning',
    tags: ['healthcare', 'support-groups', 'parent-family-resources', 'education-awareness'],
    organizationType: ['local-office', 'informed-consent-clinic', 'healthcare-provider'],
  },
  'plannedparenthood.org': {
    i18n: {
      'en-US': {
        title: 'Planned Parenthood',
        description:
          "A clinic operated by Planned Parenthood offering healthcare services including birth control, abortion referrals, HIV services, men's health care, STI testing, treatment & vaccines, transgender hormone therapy and more.",
      },
    },
    slug: 'planned-parenthood',
    tags: ['healthcare', 'transmasculine', 'transfeminine', 'non-binary'],
    organizationType: ['local-office', 'healthcare-provider', 'informed-consent-clinic'],
  },
  'fenwayhealth.org': {
    i18n: {
      'en-US': {
        title: 'Fenway Health: Comprehensive Care Center',
        description:
          "Fenway Health Clinics provide comprehensive medical and behavioral health services, focused on delivering individualized care to all, including the transgender community. Their team of expert providers prioritizes affirming, inclusive, and personalized health care solutions to meet each patient's unique needs.",
      },
    },
    slug: 'fenway',
    tags: ['healthcare'],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'borregohealth.org': {
    i18n: {
      'en-US': {
        title: 'Borrego Health - Specialty Clinic',
        description:
          'Borrego Health offers comprehensive health services specifically geared towards the transgender community, including transgender health services and specialized care such as HIV/AIDS, PrEP/PEP, and Hepatitis B & C treatment. Our healthcare professionals are trained and sensitive to transgender issues, making our clinic a safe, inclusive and welcoming environment for all.',
      },
    },
    slug: 'borrego-health-specialty-clinic',
    tags: ['healthcare'],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'thundermisthealth.org': {
    i18n: {
      'en-US': {
        title: 'Thundermist Health Center',
        description:
          'Thundermist Health Centre is an inclusive healthcare provider with emphasis on superior care for the transgender community. Services offered include general medical care, dental care, behavioral health services, prenatal care, among others. They have a dedicated Trans Health Access team who work to provide a safe, comprehensive, affirming environment for transgender people. They provide hormone therapy using the informed consent model, transgender youth services and behavioral health services for transgender people and their families. All services are available irrespective of ability to pay.',
      },
    },
    slug: 'thundermist-health-center',
    tags: [
      'transmasculine',
      'transfeminine',
      'non-binary',
      'healthcare',
      'mental-health',
      'youth-services',
      'support-groups',
      'parent-family-resources',
    ],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'anchorhealthct.org': {
    i18n: {
      'en-US': {
        title: 'Anchor Health Connecticut - A Leader in LGBTQ Health',
        description:
          'Anchor Health provides groundbreaking, radically inclusive, gender-affirming, and sex-positive care for the LGBTQ community, with a focus on transgender and gender diverse individuals. They offer a range of services such as primary care, behavioral health, sexual health, and HIV prevention with a holistic approach, striving to create a safe and understanding environment for queer individuals.',
      },
    },
    slug: 'anchor-health-connecticut',
    tags: [
      'transmasculine',
      'transfeminine',
      'non-binary',
      'healthcare',
      'mental-health',
      'youth-services',
      'support-groups',
      'parent-family-resources',
    ],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'circlecarecenter.org': {
    i18n: {
      'en-US': {
        title: 'Circle Care Center',
        description:
          'Located in Connecticut, Circle Care Center is an LGBTQI+ affirming medical services and sexual health center. Offering a range of services such as Primary Care, HIV Treatment & Care, Behavioral Health, and Gender-Affirming Care. It is dedicated to creating a supportive and inclusive environment for the transgender community, providing name and gender change assistance to help ease the transition process. The warm, caring, and committed staff makes it a safe space for those seeking medical attention.',
      },
    },
    slug: 'circle-care-center',
    tags: ['healthcare', 'legal', 'non-binary', 'transfeminine', 'transmasculine'],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'callen-lorde.org': {
    i18n: {
      'en-US': {
        title: 'Callen-Lorde Community Health Center',
        description:
          "Callen-Lorde is a healthcare provider specializing in LGBTQ health. They offer a comprehensive range of services including Adolescent Health, Behavioral Health, HIV Services, Sexual Health, Transgender health, and Women’s Health. They cater to the unique healthcare needs of the transgender community, providing resources and services in a safe, inclusive, and supportive environment. Callen-Lorde's focus on health justice for the LGBTQ community makes it a vital resource for transgender patients.",
      },
    },
    slug: 'callen-lorde-community-health-center',
    tags: [
      'healthcare',
      'mental-health',
      'transmasculine',
      'non-binary',
      'transfeminine',
      'social-services',
    ],
    organizationType: ['local-office', 'informed-consent-clinic', 'healthcare-provider'],
  },
  'chasebrexton.org': {
    i18n: {
      'en-US': {
        title: 'Chase Brexton Health Services',
        description:
          'Chase Brexton Health Services is an inclusive healthcare provider offering a broad range of services that especially cater to the transgender community. Among these services are therapy, Gender Affirming Care, and a variety of health management programs. They have created an empathetic environment that addresses the unique healthcare needs of transmasculine, transfeminine, and non-binary individuals.',
      },
    },
    slug: 'chase-brexton-health-services',
    tags: ['healthcare', 'mental-health', 'social-services'],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'whitman-walker.org': {
    i18n: {
      'en-US': {
        title: 'Whitman-Walker',
        description:
          "Whitman-Walker is a dedicated healthcare provider, offering a comprehensive range of services tailored to the transgender community. Our services include HIV/STI testing, PrEP PEP, and support relating to insurance navigation, gender affirming care, youth & family, legal services, dental health, and behavioral health. We prioritize patient care, focusing on each individual's unique needs and challenges.",
      },
    },
    slug: 'whitman-walker',
    tags: [
      'healthcare',
      'legal',
      'mental-health',
      'youth-services',
      'support-groups',
      'parent-family-resources',
      'education-awareness',
    ],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'wncchs.org': {
    i18n: {
      'en-US': {
        title: 'Western North Carolina Community Health Services',
        description:
          'Providing inclusive medical and health services to the transgender community, with a comprehensive range of services from primary care to mental health and HIV care. Our mission is ensuring everyone, especially those in the LGBTQ+ community, have access to high-quality, respectful, and non-stigmatizing care.',
      },
    },
    slug: 'western-north-carolina-community-health-services',
    tags: [
      'healthcare',
      'mental-health',
      'social-services',
      'non-binary',
      'transfeminine',
      'transmasculine',
    ],
    organizationType: ['local-office', 'informed-consent-clinic', 'healthcare-provider'],
  },
  'education.musc.edu': {
    i18n: {
      'en-US': {
        title: 'MUSC Local Offices for Transgender Community',
        description:
          'MUSC Local Offices are dedicated to providing comprehensive, tailored healthcare services to the transgender community. They welcome transmasculine, non-binary, and transfeminine individuals to their safe, inclusive environment, offering a range of services, from medical support and legal advice to social, youth services, and support groups. Each office is equipped with responsive and empathetic professionals who understand your unique needs.',
      },
    },
    slug: 'musc-local-offices-for-transgender-community',
    tags: [
      'transmasculine',
      'non-binary',
      'transfeminine',
      'legal',
      'healthcare',
      'social-services',
      'youth-services',
      'support-groups',
    ],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'connectus.org': {
    i18n: {
      'en-US': {
        title: 'Connectus Health - Local Informed Consent Clinic',
        description:
          'Connectus Health offers a wide range of healthcare services including Primary care, pediatrics, Behavioral health, Psychiatric services and others. Specially mindful of the transgender community, Connectus provides inclusive and accessible healthcare with utmost respect to all. This local clinic offers tailored services to meet the unique health needs of transmasculine, non-binary and transfeminine individuals.',
      },
    },
    slug: 'connectus-health-local-informed-consent-clinic',
    tags: ['transmasculine', 'non-binary', 'transfeminine', 'healthcare', 'mental-health'],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'equitashealth.com': {
    i18n: {
      'en-US': {
        title: 'Equitas Health',
        description:
          'Equitas Health provides comprehensive healthcare services to the transgender community. Their team of specialists deliver gender-affirming care, mental health & recovery services, and specialized HIV care. We aim to provide a comfortable, inclusive environment where you can receive the care you need in a way that works best for you.',
      },
    },
    slug: 'equitas-health',
    tags: ['transmasculine', 'transfeminine', 'healthcare', 'mental-health'],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'kindclinic.org': {
    i18n: {
      'en-US': {
        title: 'Kind Clinic',
        description:
          'Kind Clinic provides no-cost sexual health services to people of all races, creeds, gender identities and expressions, immigration statuses, sexual orientations, insurance statuses, and abilities to pay. The clinic offers patient advocates with expertise serving the LGBTQIA+ community, free walk-in HIV/STI testing and treatment services, PrEP & PEP access, HIV testing & care and gender affirming care including hormone therapy.',
      },
    },
    slug: 'kind-clinic',
    tags: ['transmasculine', 'transfeminine', 'healthcare', 'support-groups'],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'legacycommunityhealth.org': {
    i18n: {
      'en-US': {
        title: 'Legacy Community Health',
        description:
          'Legacy Community Health provides broad-ranging healthcare services within Houston, including adult medicine, behavioral health, dental services, endocrinology, HIV/STD screening, LGBTQ services, OB/GYN, pediatrics, senior care, and vaccinations. Their mission is to drive healthy change in the community through service to everyone regardless of their ability to pay.',
      },
    },
    slug: 'legacy-community-health',
    tags: [
      'healthcare',
      'mental-health',
      'support-groups',
      'non-binary',
      'transfeminine',
      'transmasculine',
      'education-awareness',
      'youth-services',
    ],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'cedarriverclinics.org': {
    i18n: {
      'en-US': {
        title: 'Cedar River Clinics',
        description:
          'Cedar River Clinics provide quality health care in a safe, culturally responsive environment. They offer wellness services, free pregnancy tests, sexually transmitted infections services, insemination services, LGBTQ services, no-scalpel vasectomy, and abortion services, among others. They particularly leverage the informed consent approach for transgender and non-binary care.',
      },
    },
    slug: 'cedar-river-clinics',
    tags: [
      'transmasculine',
      'non-binary',
      'transfeminine',
      'healthcare',
      'mental-health',
      'support-groups',
      'education-awareness',
    ],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'non-profit-organization'],
  },
  'neighborcare.org': {
    i18n: {
      'en-US': {
        title: 'Neighborcare Health',
        description:
          'Neighborcare Health is a healthcare center that provides various health-related services such as medical, pregnancy, children, dental, mental health and social work, school-based, homeless and housing, and after hours care. It promotes cultural sensitivity and community health, showcasing patient success stories and aspiring to social justice and excellence.',
      },
    },
    slug: 'neighborcare-health',
    tags: ['healthcare', 'mental-health', 'social-services', 'education-awareness'],
    organizationType: ['healthcare-provider', 'non-profit-organization', 'informed-consent-clinic'],
  },
  'ohsu.edu': {
    i18n: {
      'en-US': {
        title: 'OHSU Primary Care Clinic',
        description:
          'This OHSU clinic is dedicated to serve the people in the community including the transgender individuals. It offers services like gender-affirming primary care, alongside general and specialized health care services like adult care, pediatric care, women’s health care, pregnancy care, geriatric care, behavioral health, and wellness. The clinic emphasizes on respecting each patient’s beliefs, values, cultural needs, and providing personalized care plans that makes sense for you and your family.',
      },
    },
    slug: 'ohsu-primary-care-clinic',
    tags: ['healthcare', 'transfeminine', 'transmasculine', 'non-binary'],
    organizationType: ['local-office', 'informed-consent-clinic', 'healthcare-provider'],
  },
  'fhcsd.org': {
    i18n: {
      'en-US': {
        title: 'Family Health Centers of San Diego',
        description:
          'Committed to providing affordable and high-quality health care to everyone, especially the uninsured, low-income, and medically underserved individuals. With a list of comprehensive services, it caters to various groups including the transgender community. It provides transgender health services ensuring a safe, welcoming environment promoting essential health needs.',
      },
    },
    slug: 'family-health-centers-of-san-diego',
    tags: [
      'healthcare',
      'informed-consent-clinic',
      'non-binary',
      'transmasculine',
      'transfeminine',
    ],
    organizationType: ['local-office', 'informed-consent-clinic', 'healthcare-provider'],
  },
  'sjch.org': {
    i18n: {
      'en-US': {
        title: "St. John's Community Health, Portland",
        description:
          "St. John's Community Health provides comprehensive health services to the transgender community in Portland. Services include medical and mental health services, substance use services, a transgender health program, and various patient programs. This health center serves uninsured and underinsured populations ensuring health equity for everyone, including the transgender community.",
      },
    },
    slug: 'st-johns-community-health-portland',
    tags: ['healthcare', 'mental-health', 'social-services'],
    organizationType: ['local-office', 'informed-consent-clinic', 'healthcare-provider'],
  },
  'lalgbtcenter.org': {
    i18n: {
      'en-US': {
        title: 'Los Angeles LGBT Center',
        description:
          'A pivotal community safety net that provides health and mental services, social services and housing, culture and education, leadership and advocacy programs to the LGBT community. Our variety of departments aim to offer diverse resources including HIV/AIDS treatment and prevention, transgender health and wellness programs, services for homeless youth, senior services, legal assistance, and violence recovery programs. Our mission is to build a world where LGBT people thrive as healthy, equal, and beloved members of society.',
      },
    },
    slug: 'los-angeles-lgbt-center',
    tags: [
      'transmasculine',
      'transfeminine',
      'non-binary',
      'legal',
      'healthcare',
      'mental-health',
      'social-services',
      'youth-services',
      'support-groups',
      'parent-family-resources',
      'education-awareness',
      'community-stories',
    ],
    organizationType: ['local-office', 'informed-consent-clinic', 'healthcare-provider'],
  },
  'nhcare.org': {
    i18n: {
      'en-US': {
        title: 'Neighborhood Healthcare',
        description:
          'Neighborhood Healthcare provides comprehensive, transformative healthcare services to people of all ages and gender identities, including the transgender community. Including, Primary Care, Behavioral Health, Dental Care, Women’s Health, Prenatal, Pediatrics, Chiropractic, Acupuncture, Podiatry, Vision, Pharmacy, and Lab Services. It provides a safe, inclusive environment where transgender individuals can access quality care with dignity and respect.',
      },
    },
    slug: 'neighborhood-healthcare',
    tags: ['healthcare', 'mental-health'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'ukhealthcare.uky.edu': {
    i18n: {
      'en-US': {
        title: 'UK Healthcare Clinic',
        description:
          'The UK Healthcare Clinic strives to support the transgender community by providing a broad range of specialised medical services. The clinic ensures the delivery of quality healthcare in a respectful, safe, and friendly environment. Our services also extend to the provision of relevant resources and support groups that cater specifically to the needs of the transgender community.',
      },
    },
    slug: 'uk-healthcare-clinic',
    tags: ['healthcare', 'mental-health', 'support-groups', 'education-awareness'],
    organizationType: ['local-office', 'informed-consent-clinic', 'healthcare-provider'],
  },
  'transhealth-at-guardian.business.site': {
    i18n: {
      'en-US': {
        title: 'Transhealth /Transgender Health at Guardian - Dr. Terry Watson',
        description:
          'Transhealth /Transgender Health at Guardian, headed by Dr. Terry Watson, provides sensitive, respectful, and comprehensive healthcare services tailored for the transgender community. These services include Hormone Replacement Therapy (HRT) and other essential health care. The clinic is highly appreciated for its LGBT+ friendly environment, helpful staff, and timely services.',
      },
    },
    slug: 'transhealth-transgender-health-at-guardian-dr-terry-watson',
    tags: ['healthcare', 'transmasculine', 'transfeminine', 'non-binary'],
    organizationType: ['local-office', 'informed-consent-clinic', 'healthcare-provider'],
  },
  'villagemedical.com': {
    i18n: {
      'en-US': {
        title: 'Village Medical: Primary Care for Transgender Community',
        description:
          'Village Medical, a patient-oriented medical facility, is committed to providing healthcare that caters to the unique needs of the transgender community, offering services such as annual check-ups, diagnostic testing, illness and injury treatment, medication management, and specialist referrals. We prioritize a personalized approach to ensure our patients receive the best care and attention they need.',
      },
    },
    slug: 'village-medical-primary-care-for-transgender-community',
    tags: ['healthcare', 'support-groups', 'legal'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'bassett.org': {
    i18n: {
      'en-US': {
        title: 'Bassett Healthcare Network',
        description:
          'Bassett Healthcare Network is a comprehensive health care system offering a full range of services catered to the transgender community ensuring respectful and appropriate care for transgendere individuals. We provide services like primary care, specialty services, family dentistry, and long-term care. Our clinic embraces diversity and inclusion, promoting a positive healthcare environment for our transgender patients.',
      },
    },
    slug: 'bassett-healthcare-network',
    tags: ['healthcare', 'social-services'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'uoflhealth.org': {
    i18n: {
      'en-US': {
        title: 'UofL Health Provider',
        description:
          'UofL Health is a comprehensive healthcare provider serving all communities, including the transgender community in Louisville and surrounding areas. With a diverse team of healthcare professionals and an environment focused on compassionate, patient-centered care, UofL Health is committed to meeting the unique healthcare needs of the transgender population. They offer specialty care services, including mental health services, and have dedicated programs and resources tailored specifically to address and support gender health concerns.',
      },
    },
    slug: 'uofl-health-provider',
    tags: ['healthcare', 'mental-health'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'piedmonthealth.org': {
    i18n: {
      'en-US': {
        title: 'Piedmont Health: Gateway to Quality Healthcare',
        description:
          'Piedmont Health is a community-focused healthcare provider offering a wide range of services including medical, dental, senior care, and pharmacy services, among others. Our commitment to respect, compassion, and trust has made us a home for many, including the transgender community. With supportive and understanding staff, we strive to create an environment that respects your identity while providing quality healthcare tailored to your needs.',
      },
    },
    slug: 'piedmont-health-gateway-to-quality-healthcare',
    tags: ['healthcare', 'support-groups'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'uwhealth.org': {
    i18n: {
      'en-US': {
        title: 'UW Health Transgender Healthcare Services',
        description:
          'Based in Portland, Maine, UW Health specializes in tailored healthcare services for the transgender community. Our approach emphasizes informed consent, working to ensure all our patients are fully aware and comfortable with their care plan. Whether you identify as transmasculine, transfeminine, or non-binary, our team of medical professionals is here to guide you through your journey, providing not just physical health services but mental and social services support too.',
      },
    },
    slug: 'uw-health-transgender-healthcare-services',
    tags: [
      'transmasculine',
      'transfeminine',
      'non-binary',
      'healthcare',
      'mental-health',
      'social-services',
    ],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'essentiahealth.org': {
    i18n: {
      'en-US': {
        title: 'Essentia Health - Transgender Health Services',
        description:
          'Essentia Health is an integrated health system that caters to various health needs, including those of the transgender community. We offer tailored healthcare services in an inclusive environment, ensuring each individual feels comfortable and is given the highest standard of care. Our services range from routine consultations to specialized treatments and surgeries. Also, we offer support in the form of information, patient-visitor support, and scheduling appointments online or in-person. With our commitment to serving our diverse community, we aim to be a considerable contributor towards transgender health and wellbeing.',
      },
    },
    slug: 'essentia-health-transgender-health-services',
    tags: ['healthcare', 'mental-health', 'support-groups', 'education-awareness'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'nm.org': {
    i18n: {
      'en-US': {
        title: 'Northwestern Medicine Health Clinic | Portland, ME',
        description:
          "Northwestern Medicine's Portland office provides a range of comprehensive health services with a deep commitment to the transgender community. Whether it's in legal, healthcare, mental-health, or social-services sector, our expert teams are dedicated to serving the unique needs of the transmasculine, transfeminine and non-binary individuals. With robust support-groups and resources for parents, partners, and youth, our goal is to create an inclusive and respectful environment for all.",
      },
    },
    slug: 'northwestern-medicine-health-clinic',
    tags: [
      'transmasculine',
      'transfeminine',
      'non-binary',
      'legal',
      'healthcare',
      'mental-health',
      'social-services',
      'youth-services',
      'support-groups',
      'parent-family-resources',
      'partner-resources',
    ],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'centraloutreach.com': {
    i18n: {
      'en-US': {
        title: 'Central Outreach Wellness Center',
        description:
          'Central Outreach Wellness Center is an inclusive, holistic healthcare provider that specializes in LGBTQIA, HIV & Hep C healthcare. We understand the unique health concerns of our community and provide resources, services, and medical care with dignity, respect, and no judgement. Our centers are welcoming to everyone and specialize in comprehensive gay health care, HIV & Hep C primary care, and transgender health care.',
      },
    },
    slug: 'central-outreach-wellness-center',
    tags: ['transmasculine', 'transfeminine', 'healthcare', 'mental-health'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'kccare.org': {
    i18n: {
      'en-US': {
        title: 'KC CARE Health Center',
        description:
          'KC CARE Health Center provides whole-person care, including medical services, behavioural health, and testing services. They are particularly catered to serving the transgender community with specific services like transgender health and sexual health. KC CARE promotes health equality and believes in healthcare as a right for everyone.',
      },
    },
    slug: 'kc-care-health-center',
    tags: ['healthcare', 'transfeminine', 'transmasculine', 'non-binary'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'locations.borregohealth.org': {
    i18n: {
      'en-US': {
        title: 'Borrego Health - Specialty Clinic',
        description:
          'Borrego Health offers comprehensive health services specifically geared towards the transgender community, including transgender health services and specialized care such as HIV/AIDS, PrEP/PEP, and Hepatitis B & C treatment. Our healthcare professionals are trained and sensitive to transgender issues, making our clinic a safe, inclusive and welcoming environment for all.',
      },
    },
    slug: 'borrego-health-specialty-clinic-south-portland',
    tags: ['healthcare'],
    organizationType: ['healthcare-provider', 'informed-consent-clinic', 'local-office'],
  },
  'peacehealth.org': {
    i18n: {
      'en-US': {
        title: 'PeaceHealth - Personalized Healthcare Provider',
        description:
          'PeaceHealth aims to bring personalized healthcare for everyone, respecting the uniqueness of each individual. We provide comprehensive care services, including primary and specialty care, and ensure access to reliable health information. Focused particularly on serving the transgender community, we strive to offer a safe, comfortable and inclusive environment. Our facility underlines the significance of understanding, acceptance, and full-fledged support to make high-quality healthcare accessible for all.',
      },
    },
    slug: 'peacehealth-personalized-healthcare-provider',
    tags: ['healthcare', 'support-groups', 'education-awareness'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'opendoorhealth.com': {
    i18n: {
      'en-US': {
        title: 'Open Door Community Health Centers',
        description:
          'Open Door Community Health Centers provide quality medical, dental, and behavioral health care specifically tailored to the unique health needs of the transgender community. Services include gender affirming services, HIV services and substance use services in a welcoming and affirming environment. Open Door ensures access to healthcare for all, irrespective of financial, geographic, or social barriers.',
      },
    },
    slug: 'open-door-community-health-centers',
    tags: ['healthcare', 'transfeminine', 'transmasculine', 'non-binary'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'hopkinsmedicine.org': {
    i18n: {
      'en-US': {
        title: 'Johns Hopkins Medicine',
        description:
          'Johns Hopkins Medicine, located in Portland, Maine, is a renowned healthcare provider. We have a diverse team of doctors, researchers, and care providers dedicated to improving health for all through excellence in patient care, research, education, and community service. We are committed to providing inclusive and respectful care for the transgender community and emphasize mental health support, community awareness, and healthcare tailored to individual needs.',
      },
    },
    slug: 'johns-hopkins-medicine',
    tags: ['healthcare', 'mental-health', 'education-awareness'],
    organizationType: ['local-office', 'informed-consent-clinic', 'healthcare-provider'],
  },
  'metrohealth.org': {
    i18n: {
      'en-US': {
        title: 'MetroHealth System in Cleveland',
        description:
          'MetroHealth is a comprehensive healthcare provider offering various services including behavioral health, cancer treatment, obstetrics & gynecology, pharmacy programs, and a rehabilitation institute. Its commitment to inclusion, diversity, and racial equity is evident through its initiatives and resources. The healthcare provider offers a supportive and safe environment for the transgender community with resources tailored to their necessities and wellbeing.',
      },
    },
    slug: 'metrohealth-system-in-cleveland',
    tags: ['healthcare'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'healthy.kaiserpermanente.org': {
    i18n: {
      'en-US': {
        title: 'Kaiser Permanente Health Services',
        description:
          'Kaiser Permanente offers a range of health services tailored to the needs of the transgender community including medical care, mental health support, and wellness resources. Their inclusive environment makes it easy for patients to discuss their concerns, coordinate care, and find the right health solutions.',
      },
    },
    slug: 'kaiser-permanente-health-services',
    tags: ['healthcare', 'mental-health', 'support-groups'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'hopeandhelp.org': {
    i18n: {
      'en-US': {
        title: 'Hope & Help Center of Central Florida',
        description:
          'Hope & Help offers HIV/STI preventive and treatment as well as primary care to the transgender community, among other patients, across Florida. Dedicated to removing barriers that prevent people from accessing HIV/STI education, prevention resources, testing, and treatment, it provides essential health services in a safe and inclusive environment.',
      },
    },
    slug: 'hope-help-center-of-central-florida',
    tags: ['healthcare', 'support-groups', 'mental-health'],
    organizationType: ['informed-consent-clinic', 'local-office'],
  },
  'cancommunityhealth.org': {
    i18n: {
      'en-US': {
        title: 'CAN Community Health',
        description:
          'CAN Community Health is a community health center focused on providing healthcare services to individuals affected by HIV, Hepatitis C and other sexually transmitted diseases. They are committed to inclusivity and diversity, ensuring that they provide excellent healthcare regardless of race, color, gender, personal beliefs, disability, etc. They also offer a wide range of services tailored specifically to the needs of transgender people, including education, research, outreach, and support.',
      },
    },
    slug: 'can-community-health',
    tags: ['healthcare', 'support-groups', 'medicine'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'care.aurorahealthcare.org': {
    i18n: {
      'en-US': {
        title: 'Aurora Health Care',
        description:
          'Aurora Health Care is an informed consent clinic and local office that caters to the transgender community providing healthcare services. They ensure transgender patients feel comfortable, respected, and empowered to take an active role in their health care.',
      },
    },
    slug: 'aurora-health-care',
    tags: ['healthcare', 'legal', 'support-groups', 'community-stories', 'education-awareness'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'cowlitzfamilyhealth.org': {
    i18n: {
      'en-US': {
        title: 'Cowlitz Family Health Center - Comprehensive Health Services',
        description:
          'Committed to cater to the health care needs of the transgender community, Cowlitz Family Health Center provides an inclusive and compassionate care environment. It offers primary and preventative medical care, chronic disease management, family planning, and more, consciously acknowledging and addressing the unique health issues faced by transmasculine, transfeminine, and non-binary individuals.',
      },
    },
    slug: 'cowlitz-family-health-center-comprehensive-health-services',
    tags: ['transmasculine', 'transfeminine', 'non-binary', 'healthcare'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'aplahealth.org': {
    i18n: {
      'en-US': {
        title: 'APLA Health Services',
        description:
          'APLA Health provides an extensive range of services that cater to the LGBTQ+ and HIV/AIDS communities. They offer a plethora of aid ranging from primary care, sexual health services, HIV specialty care, and behavioral healthcare. Additionally, they offer transgender-specific health services, ensuring tailored care to the transgender community. Their services also extend to insurance enrollment, vaccination information, and Housing support. Committed to inclusivity and equality, APLA Health strives to deliver comprehensive healthcare for all.',
      },
    },
    slug: 'apla-health-services',
    tags: ['transfeminine', 'transmasculine', 'non-binary', 'healthcare', 'support-groups'],
    organizationType: ['informed-consent-clinic', 'local-office'],
  },
  'centroararat.org': {
    i18n: {
      'es-MX': {
        title: 'Centro Ararat',
        description:
          'Centro Ararat ofrece una variedad de servicios de salud sexual, incluyendo pruebas de VIH y consulta PrEP. Nos esforzamos por crear un espacio segura y acogedora para la comunidad transgénero.',
      },
      'en-US': {
        title: 'Ararat Center',
        description:
          'Ararat Center provides a variety of sexual health services, including rapid HIV testing and PrEP consultation. We strive to create a safe and welcoming space for the transgender community.',
      },
    },
    slug: 'ararat-center',
    tags: ['healthcare', 'transfeminine', 'transmasculine', 'non-binary'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'onemedical.com': {
    i18n: {
      'en-US': {
        title: 'One Medical - Exceptional Primary Care',
        description:
          'One Medical offers exceptional primary care facilities and personalized attention to all patients, including the transgender community. The office schedules long appointments for in-depth discussions and has multiple services covering everything from chronic care to mental health issues. It offers compassionate care, recognizing the unique medical and emotional needs of transgender individuals. Practitioners are experienced in handling sensitive matters such as hormone replacement therapy, post-surgery care, and transgender-specific mental health care.',
      },
    },
    slug: 'one-medical-exceptional-primary-care',
    tags: ['healthcare', 'informed-consent-clinic'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'uphealthsystem.com': {
    i18n: {
      'en-US': {
        title: 'UP Health System',
        description:
          'UP Health System is a local health care provider that offers a wide range of medical services. This organization is dedicated to providing quality health care for everyone in the community, including those in the transgender community. They provide a safe, non-judgmental environment where individuals can receive care that is sensitive to their needs.',
      },
    },
    slug: 'up-health-system',
    tags: ['healthcare', 'support-groups'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'mainlinehealth.org': {
    i18n: {
      'en-US': {
        title: 'Main Line Health',
        description:
          'Main Line Health offers various healthcare services with a compassionate approach to the transgender community. From specialized mental health to legal support services, our office provides inclusive healthcare tailored to meet the unique needs of transmasculine, transfeminine, and non-binary individuals. We believe in creating an environment that recognizes and respects the individuality of every patient.',
      },
    },
    slug: 'main-line-health',
    tags: [
      'transmasculine',
      'non-binary',
      'transfeminine',
      'legal',
      'healthcare',
      'mental-health',
      'support-groups',
      'education-awareness',
    ],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'novanthealth.org': {
    i18n: {
      'en-US': {
        title: 'Novant Health Comprehensive Transgender Care',
        description:
          'At Novant Health, we are dedicated to providing compassionate and inclusive healthcare for the transgender community. We offer primary care, urgent care, walk-in care, and emergency care tailored to the unique health needs of the transmasculine, transfeminine, and non-binary individuals. Our interactive online portal, MyNovant, allows you to manage all your health information in one place. With our team of expert and empathetic providers, start your journey towards better health.',
      },
    },
    slug: 'novant-health-transgender-care',
    tags: ['healthcare', 'transmasculine', 'transfeminine', 'non-binary'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'westbrookclinic.org': {
    i18n: {
      'en-US': {
        title: 'Westbrook Clinic - HIV/AIDS & STI Services',
        description:
          'Westbrook Clinic, a division of the Valley AIDS Council, is dedicated to providing comprehensive HIV/AIDS and STI health services, information and support to the community, particularly focusing on the needs of the transgender community. The clinic offers an array of medical care options, pharmaceutical services, education programs, and other resources like housing and support to those diagnosed and living with HIV/AIDS, as well as providing HIV testing services to the public. Their commitment to patient privacy, dignity, and equality make them a welcoming place for transgender individuals seeking care.',
      },
      es: {
        title: 'Clínica Westbrook - Servicios de VIH/SIDA y ITS',
        description:
          'La Clínica Westbrook, una división del Valley AIDS Council, se dedica a proporcionar servicios de salud integrales para el VIH/SIDA y las ITS, información y apoyo a la comunidad, centrándose particularmente en las necesidades de la comunidad transgénero. La clínica ofrece una gama de opciones de atención médica, servicios farmacéuticos, programas de educación y otros recursos como viviendas y apoyo para las personas diagnosticadas y que viven con el VIH/SIDA, así como servicios de pruebas de VIH para el público. Su compromiso con la privacidad del paciente, la dignidad y la igualdad hacen de ellos un lugar acogedor para las personas transgénero que buscan atención.',
      },
    },
    slug: 'westbrook-clinic-hiv-aids-sti-services',
    tags: ['healthcare', 'legal', 'social-services'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
  'healthq.org': {
    i18n: {
      'en-US': {
        title: 'HealthQ - Comprehensive Health Services for All',
        description:
          'HealthQ provides a comprehensive range of sexual and reproductive health care, including gender affirming care and laser hair removal for gender affirmation. We are committed to providing specialized, individualized care in an inclusive and non-judgmental environment, respecting all genders, sexual orientations, and identities.',
      },
    },
    slug: 'healthq-comprehensive-health-services-for-all',
    tags: ['transmasculine', 'non-binary', 'transfeminine', 'healthcare'],
    organizationType: ['local-office', 'informed-consent-clinic'],
  },
}

const sanitizeUrl = (url: string) => {
  if (!url) return ''
  let sanitizedUrl = url.replace(/www./g, '') // remove 'www.'
  if (sanitizedUrl.endsWith('/')) {
    // remove trailing slash
    sanitizedUrl = sanitizedUrl.slice(0, -1)
  }
  return sanitizedUrl
}

const model = new OpenAI({ modelName: 'gpt-4' })
const template = `{content}

The above content was extracted from {url}. {additional} Tags must consist of only values from [transmasculine, non-binary, transfeminine, legal, healthcare, mental-health, social-services, youth-services, support-groups, parent-family-resources, partner-resources, community-stories, education-awareness, financial-aid-scholarships, clothing, artists-creators, friendly-businesses, makeup, voice-training, discord-groups, spiritual], and organizationType should only contain values from [national-organization, local-office, community-center, online-platform, healthcare-provider, informed-consent-clinic, support-group, legal-service, educational-institution, non-profit-organization, government-entity, private-practice]. Determine the language of the content, and convert the content into a JSON object with the necessary translations for English (if it isn't English) and the original language. Here is the id of the content: {uuid}. Please wrap the output in triple backticks. Use null when you cannot fill a field. Here is the JSON schema:

\`\`\`
{{
  id: string [required]
  i18n: {{
    "en-US": {{
      title: string [required] (A short title for the resource)
      description: string [required] (A short description about what the resource is about and how it serves the transgender community)
    }},
    "other-lang": {{
      title: string [required]
      description: string [required]
    }}
  }}
  slug: string [required] [unique] (en-US, kebab-case)
  externalUrl: Url (string)
  tags: string[] (attribute all that are relevant)
  organizationType: string[] (attribute all that are relevant)
  address: Address (string) [optional, Google Maps friendly]
  phoneNumber: PhoneNumber (string) [optional]
  country: Country (string) [optional] (two letter country code)
  provinceOrState: ProvinceOrState (string) [optional] (two letter province or state code)
  city: City (string) [optional]
  county: County (string) [optional]
  latLng: LatLng (string) [optional] 
  email: Email (string) [optional]
  socialMedia: {{ yelpUrl: Url, googleMapsUrl: Url, ... }} [optional]
}}
\`\`\``
const translationPrompt = new PromptTemplate({
  template,
  inputVariables: ['url', 'additional', 'content', 'uuid'],
})

const processAddress = async (translatedJsonObject: any) => {
  console.log(`Processing address: ${translatedJsonObject.address}...`)

  const address = translatedJsonObject.address

  const geocodeResponse = await googleMapsClient.geocode({
    params: {
      key: process.env.GOOGLE_MAPS_API_KEY ?? '',
      address: address,
    },
    timeout: 1000,
  })

  if (geocodeResponse.data.status === 'OK') {
    console.log(`Geocode response: ${JSON.stringify(geocodeResponse.data, null, 2)}`)

    const country = geocodeResponse.data.results
      .find((result) =>
        result.address_components.find((component) =>
          component.types.includes('country' as AddressType),
        ),
      )
      ?.address_components.find((component) => component.types.includes('country' as AddressType))
      ?.short_name

    console.log(`Country: ${country}`)

    const provinceOrState = geocodeResponse.data.results
      .find((result) =>
        result.address_components.find((component) =>
          component.types.includes('administrative_area_level_1' as AddressType),
        ),
      )
      ?.address_components.find((component) =>
        component.types.includes('administrative_area_level_1' as AddressType),
      )?.short_name

    const county = geocodeResponse.data.results
      .find((result) =>
        result.address_components.find((component) =>
          component.types.includes('administrative_area_level_2' as AddressType),
        ),
      )
      ?.address_components.find((component) =>
        component.types.includes('administrative_area_level_2' as AddressType),
      )?.short_name

    const city = geocodeResponse.data.results
      .find((result) =>
        result.address_components.find(
          (component) =>
            component.types.includes('locality' as AddressType) ||
            component.types.includes('neighborhood' as AddressType),
        ),
      )
      ?.address_components.find(
        (component) =>
          component.types.includes('locality' as AddressType) ||
          component.types.includes('neighborhood' as AddressType),
      )?.short_name

    const town = geocodeResponse.data.results
      .find((result) =>
        result.address_components.find((component) =>
          component.types.includes('sublocality' as AddressType),
        ),
      )
      ?.address_components.find((component) =>
        component.types.includes('sublocality' as AddressType),
      )?.short_name

    const latLngComponent = geocodeResponse.data.results.find((result) =>
      result.address_components.find((component) =>
        component.types.includes('street_address' as AddressType),
      ),
    )

    const latLng = [latLngComponent?.geometry.location.lat, latLngComponent?.geometry.location.lng]

    const address = geocodeResponse.data.results.find((result) =>
      result.address_components.find((component) =>
        component.types.includes('street_address' as AddressType),
      ),
    )?.formatted_address

    console.log(
      `About to return... ${JSON.stringify(
        {
          ...translatedJsonObject,
          country,
          provinceOrState,
          county,
          city,
          town,
          latLng,
          address,
        },
        null,
        2,
      )}`,
    )

    return {
      ...translatedJsonObject,
      country,
      provinceOrState,
      county,
      city,
      town,
      latLng,
      address,
    }
  } else {
    console.log(`Geocode response status: ${geocodeResponse.data.status}`)
    return translatedJsonObject
  }
}

const processUrl = async (clinic: any) => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  let url: string

  if (typeof clinic === 'string') {
    url = clinic
    clinic = {
      website: clinic,
    }
  } else {
    url = clinic.website
  }

  await page.goto(url)

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  // wait for the page to be in the ready state, no network activity
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve(true)
      } else {
        const readyStateCheckInterval = setInterval(() => {
          if (document.readyState === 'complete') {
            clearInterval(readyStateCheckInterval)
            resolve(true)
          }
        }, 10)
      }
    })
  })

  // get the page text content
  // we need to strip css and other stuff from the page
  // so we only get the text
  // we will remove those elements from the page
  const textContent = await page.evaluate(() => {
    const selectors = ['script', 'style', 'svg', 'img', 'iframe', 'canvas', 'video', 'noscript']

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector)
      try {
        elements.forEach((e) => e.remove())
      } catch (err) {
        // do nothing
      }
    })

    const textContent = document.querySelector('body')?.textContent

    // now we need to remove unncecessary whitespace surrounding and in the text
    // we will use a regex to remove all whitespace
    // except for single spaces

    return textContent?.replace(/\s\s+/g, ' ')
  })

  const splitter = new TokenTextSplitter({
    encodingName: 'gpt2',
    chunkSize: 7000,
    chunkOverlap: 0,
  })

  const output = await splitter.createDocuments([textContent ?? ''])

  await browser.close()

  // now we need to translate the text content into JSON
  // we will use GPT-4 for this

  const id = v4()

  const input = await translationPrompt.format({
    url,
    content: output[0].pageContent,
    additional: `It is an organization of type "local-office" and "informed-consent-clinic"${
      clinic.address ? `, it has the address ${clinic.address}` : ''
    }${clinic.phoneNumber ? `, phone number ${clinic.phoneNumber}` : ''}${
      clinic.googleMapsLink ? `Google Maps Url is ${clinic.googleMapsLink}` : ''
    }. This is a single office but the description and title should be written so that it can be used for multiple offices. Description should explain how this office tailors to the transgender community.`,
    uuid: id,
  })

  const response = await model.call(input)

  let translatedJson = response.match(/(\{[\s\S]*\})/)?.[1]?.trim()
  let translatedJsonObject: any

  if (!translatedJson) {
    try {
      translatedJsonObject = JSON.parse(response.trim())
    } catch (err) {
      console.error(`Could not extract translated JSON from response: ${response}`)
    }
  } else {
    try {
      translatedJsonObject = JSON.parse(translatedJson)
    } catch (err) {
      console.error(`Could not extract translated JSON from response: ${response}`)
    }
  }

  const fileName = `${id}.json`

  // if an address is provided, let's process it with Google Maps
  if (translatedJsonObject.address) {
    translatedJsonObject = await processAddress(translatedJsonObject)
  }

  try {
    const response = await fetch('https://transgender.org/resources.json')
    const resources = await response.json()

    const resourceExists = resources.find(
      (resource: any) =>
        sanitizeUrl(resource.externalUrl) === sanitizeUrl(url) &&
        resource.address === translatedJsonObject.address,
    )

    if (resourceExists) {
      console.log(`Resource already exists: ${url}`)

      return
    }
  } catch (error) {
    console.log(error)
  }

  await writeFile(path.join(INPUT_DIR, fileName), JSON.stringify(translatedJsonObject, null, 2))

  console.log(`Wrote ${fileName} to ${INPUT_DIR}`)
}

const informedConsentClinicsText = fs.readFileSync(
  path.join(__dirname, '../informed-consent-clinics.json'),
  'utf-8',
)

try {
  const skip = process.argv[2] ? parseInt(process.argv[2]) : 0

  if (isNaN(skip)) {
    throw new Error('Skip is not a number')
  }

  const informedConsentClinics = JSON.parse(informedConsentClinicsText)

  ;(async () => {
    const chunkSize = 20
    // Adjust the array to respect the skip
    const informedConsentClinicsAdjusted = informedConsentClinics.slice(skip)

    const clinicChunks = Array(Math.ceil(informedConsentClinicsAdjusted.length / chunkSize))
      .fill(null)
      .map((_, index) => {
        return informedConsentClinicsAdjusted.slice(index * chunkSize, (index + 1) * chunkSize)
      })

    for (let i = 0; i < clinicChunks.length; i++) {
      const chunk = clinicChunks[i]
      // Process each chunk in parallel
      await Promise.all(
        chunk.map(async (clinic: any, index: number) => {
          if (!clinic) {
            return
          }

          const defaultSetKeys = Object.keys(defaultSet)

          const defaultSetKey = defaultSetKeys.find((key) => clinic.website.includes(key))

          if (defaultSetKey) {
            const defaultSetClinic = defaultSet[defaultSetKey]
            const id = v4()
            const fileName = `${id}.json`

            const translatedJsonObject = await processAddress({
              ...defaultSetClinic,
              id,
              externalUrl: clinic.website,
              address: clinic.address,
              phoneNumber: clinic.phoneNumber,
              socialMedia: {
                googleMapsUrl: clinic.googleMapsLink,
              },
            })

            if (!translatedJsonObject.city) {
              console.log(
                `DEFAULTSET: No city found for ${JSON.stringify(translatedJsonObject, null, 2)}`,
              )
            }

            translatedJsonObject.slug = `${defaultSetClinic.slug}-${paramCase(
              translatedJsonObject.city,
            )}`
            await writeFile(
              path.join(INPUT_DIR, fileName),
              JSON.stringify(translatedJsonObject, null, 2),
            )

            console.log(`DEFAULTSET: Wrote ${fileName} to ${INPUT_DIR}`)
          } else {
            await processUrl(clinic)
          }

          // Log last processed index
          const lastProcessedIndex = skip + i * chunkSize + index
          console.log(`Last processed index: ${lastProcessedIndex}`)
        }),
      )

      // Pause for 5 seconds
      console.log('Pausing for 5 seconds...')
      console.log(`Last processed index: ${skip + i * chunkSize + chunkSize - 1}`)
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  })()
} catch (error) {
  ;(async () => {
    const url = process.argv[2]

    const defaultSetKeys = Object.keys(defaultSet)

    const defaultSetKey = defaultSetKeys.find((key) => url.includes(key))

    if (defaultSetKey) {
      const defaultSetClinic = defaultSet[defaultSetKey]

      const id = v4()

      const fileName = `${id}.json`

      const translatedJsonObject = await processAddress({
        ...defaultSetClinic,
        id,
        externalUrl: url,
        address: '123 Main St, Portland, ME 04101',
        phoneNumber: '207-555-5555',
      })

      translatedJsonObject.slug = `${defaultSetClinic.slug}-${paramCase(translatedJsonObject.city)}`
      await writeFile(path.join(INPUT_DIR, fileName), JSON.stringify(translatedJsonObject, null, 2))

      console.log(`DEFAULTSET: Wrote ${fileName} to ${INPUT_DIR}`)
    } else {
      await processUrl({
        website: url,
        address: '123 Main St, Portland, ME 04101',
        phoneNumber: '207-555-5555',
      })
    }
  })()
}

export {}
