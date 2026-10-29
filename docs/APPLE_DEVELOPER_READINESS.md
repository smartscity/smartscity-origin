# Apple Developer organization enrollment readiness

Reviewed: 2026-10-30. This is a website readiness record, not Apple approval or a guarantee of acceptance. Project maturity and legal eligibility are separate from website completeness.

## 1. Verified and completed

- The existing HTTPS homepage at https://www.smartscity.com/en/ opened in the browser on the review date. The GitHub → Cloudflare Pages pipeline was previously proven by successful deployments for two pushed commits.
- English remains the default. Dedicated English and Simplified Chinese About and Contact pages reuse the existing layout, project registry, colors, and typography.
- Company identity is centralized. The visible operator statement, footer and Organization JSON-LD use the exact owner-supplied Chinese legal name. The English reference translation is explicitly labeled and does not replace that legal name.
- The owner supplied the registration region and domain-based public mailbox. Contact links use `mailto:`; there is no contact form, submission backend, or delivery claim.
- About pages explain the business focus, four projects and engineering philosophy. Project descriptions retain existing public-evidence limitations.
- Global navigation includes About, Contact, Projects, GitHub and Privacy. Locale switching preserves the corresponding route; canonical and alternate-language links identify the official domain.
- Privacy text reflects the implementation: theme preference in local storage, transient local demos, local assets/system fonts, no application analytics/tracking cookies, no embedded external frames or forms, and external email/GitHub navigation. Hosting request processing is distinguished from application behavior.
- The unsupported registered-trademark symbol was removed. Unknown address, telephone, registration number, ratings and certifications are not emitted.

The corporate update is deployed: source commit `e98bd48` passed GitHub quality checks and Cloudflare deployment. All four new corporate routes were opened on the official HTTPS domain, with matching rendered identity, email, canonical and structured data. See [VALIDATION.md](./VALIDATION.md) for exact deployment and CI evidence.

## 2. Implemented but awaiting real company data

The typed company model and shared presentation support an approved public business address, business telephone, registration number and officially registered English name. These values are absent and omitted from the public site. The reference translation is not evidence of a registered English name.

The owner supplied the entity and brand context, region and mailbox for publication. Independent reconciliation with registration records and a mailbox receiving test remain outstanding. See [the corporate checklist](../COMPANY_IDENTITY_TODO.md). Optional missing website fields do not imply that every such field is an Apple enrollment requirement.

## 3. External verification required

Apple's [official enrollment guidance](https://developer.apple.com/help/account/membership/program-enrollment/) requires an eligible legal entity, its legal name and normally a D-U-N-S number, an authorized signatory, a work email associated with the organization, and a publicly functional website on an associated domain. The applicant also needs an Apple Account with two-factor authentication and must meet the applicable age requirement. Apple may request additional verification.

Still **NOT_VERIFIED** by this website task:

- Legal entity eligibility and exact correspondence between registration records, D-U-N-S records and the application; a brand or reference translation is not a substitute.
- D-U-N-S verification, without publishing the number or private records here.
- The applicant's authority to bind the organization.
- Apple Account identity, two-factor authentication and applicable age requirement.
- Access to and actual receipt of email at the supplied work mailbox; domain/company legal association.
- Apple's own review, any requested documentary evidence, and final acceptance.

**Assessment:** the website now exposes substantially clearer organization and contact information. Enrollment remains dependent on the external checks above. No DNS, MX, corporate-email configuration, or Apple enrollment settings are changed by this task.
