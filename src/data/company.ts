import type { Locale } from '../i18n';

/** Only publication-approved facts with an explicit source belong in this model. */
export interface PublicFact<T> {
  readonly value: T;
  readonly source: string;
  readonly verifiedOn: string;
  readonly approvedForPublication: true;
}
export interface PublicAddress {
  readonly streetAddress: string;
  readonly addressLocality: string;
  readonly addressRegion?: string;
  readonly postalCode?: string;
  readonly addressCountry: string;
}
export interface CompanyIdentity {
  readonly brandName: string;
  readonly chineseBrandName: string;
  readonly website: `https://${string}`;
  readonly logoPath: string;
  readonly githubOrganization: `https://github.com/${string}`;
  /** This record establishes the brand operator, not just a similarly named entity. */
  readonly operator?: PublicFact<{
    readonly legalName: string;
    readonly registeredEnglishName?: string;
    readonly registeredChineseName?: string;
    readonly referenceEnglishTranslation?: string;
  }>;
  readonly countryOfIncorporation?: PublicFact<Record<Locale, string>>;
  readonly businessAddress?: PublicFact<PublicAddress>;
  readonly email?: PublicFact<string> & {
    readonly receivingConfirmedByOwner: true;
  };
  readonly telephone?: PublicFact<string>;
  readonly registrationNumber?: PublicFact<string>;
}

const ownerConfirmation = {
  source:
    'Company information supplied for publication by the site owner on 2026-10-30; not independently reconciled with registry or D-U-N-S records.',
  verifiedOn: '2026-10-30',
  approvedForPublication: true,
} as const;

export const company: CompanyIdentity = {
  brandName: 'Smartscity',
  chineseBrandName: '必赢科技',
  website: 'https://www.smartscity.com',
  logoPath: '/images/smartscity.png',
  githubOrganization: 'https://github.com/smartscity',
  operator: {
    ...ownerConfirmation,
    value: {
      legalName: '必赢科技（北京）有限公司',
      registeredChineseName: '必赢科技（北京）有限公司',
      referenceEnglishTranslation: 'Biying Technology (Beijing) Co., Ltd.',
    },
  },
  countryOfIncorporation: {
    ...ownerConfirmation,
    value: { en: 'China (mainland)', 'zh-CN': '中国大陆' },
  },
  email: {
    ...ownerConfirmation,
    value: 'liyunlong@smartscity.com',
    receivingConfirmedByOwner: true,
  },
};

/** A single projection keeps visible facts and machine-readable identity in agreement. */
export function organizationData(identity: CompanyIdentity = company) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${identity.website}/#organization`,
    name: identity.brandName,
    alternateName: identity.chineseBrandName,
    url: identity.website,
    logo: new URL(identity.logoPath, identity.website).href,
    sameAs: [identity.githubOrganization],
    ...(identity.operator && { legalName: identity.operator.value.legalName }),
    ...(identity.email && { email: identity.email.value }),
    ...(identity.businessAddress && {
      address: { '@type': 'PostalAddress', ...identity.businessAddress.value },
    }),
    ...(identity.telephone && { telephone: identity.telephone.value }),
  };
}

/** Never let legal text accidentally terminate the JSON-LD script element. */
export function organizationJson(identity: CompanyIdentity = company) {
  return JSON.stringify(organizationData(identity)).replace(/</g, '\\u003c');
}
