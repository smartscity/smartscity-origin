import { describe, expect, it } from 'vitest';
import {
  company,
  organizationData,
  organizationJson,
  type CompanyIdentity,
} from '../src/data/company';

describe('public corporate identity', () => {
  it('keeps the registered Chinese name separate from the reference translation', () => {
    const data = organizationData();
    expect(data.legalName).toBe('必赢科技（北京）有限公司');
    expect(data.legalName).not.toBe(
      company.operator?.value.referenceEnglishTranslation,
    );
    expect(company.operator?.value.registeredEnglishName).toBeUndefined();
    expect(data.email).toBe(company.email?.value);
    expect(data.url).toBe(company.website);
    expect(data.sameAs).toEqual([company.githubOrganization]);
    expect(data).not.toHaveProperty('address');
    expect(data).not.toHaveProperty('telephone');
    expect(data).not.toHaveProperty('identifier');
  });

  it('omits absent corporate facts instead of emitting placeholders', () => {
    const minimal: CompanyIdentity = {
      brandName: company.brandName,
      chineseBrandName: company.chineseBrandName,
      website: company.website,
      logoPath: company.logoPath,
      githubOrganization: company.githubOrganization,
    };
    const data = organizationData(minimal);
    for (const key of ['legalName', 'email', 'address', 'telephone']) {
      expect(data).not.toHaveProperty(key);
    }
  });

  it('safely serializes text that could otherwise terminate a script', () => {
    const identity = {
      ...company,
      brandName: '</script><script>alert(1)</script>',
    };
    const json = organizationJson(identity);
    expect(json).not.toContain('<');
    expect(JSON.parse(json).name).toBe(identity.brandName);
  });
});
