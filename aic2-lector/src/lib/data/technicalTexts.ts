import type { Text } from '$lib/db';

const agentRegistryBody = `Agent Registry is a shared inventory for agents, MCP servers, APIs, model proxies, and gateways. A team can search the catalog before it builds a new asset. Each catalog page can show conformance status, instance health, and lifecycle information. Teams can publish an asset so other teams can reuse it. Scanners help keep the inventory current. They connect to supported platforms, discover assets on demand or on a schedule, and register the results in the matching catalog. The registry therefore improves discovery, reuse, and governance across platforms.`;

const pilotParallelGroup = 'mulesoft-b1-technical-pilot-v1';

function makePilotText({
  id,
  title,
  body,
  parallel_form,
  retest_only = false,
  key_vocabulary,
}: {
  id: string;
  title: string;
  body: string;
  parallel_form: 'A' | 'B' | 'C';
  retest_only?: boolean;
  key_vocabulary: string[];
}): Text {
  const words = body.trim().split(/\s+/);
  return {
    id,
    title,
    body,
    cefr_level: 'B1',
    genre: 'technical-ia',
    word_count: words.length,
    unique_words: new Set(body.toLowerCase().match(/[a-z]+/g) ?? []).size,
    avg_sentence_length: Math.round(words.length / body.split(/[.!?]+/).filter(Boolean).length),
    source: 'synthetic-pilot; verify technical claims against official MuleSoft documentation',
    parallel_group: pilotParallelGroup,
    parallel_form,
    retest_only,
    is_authentic: false,
    key_vocabulary,
    created_at: new Date(),
  };
}

const pilotFormABody = `A platform team may know that a useful API or agent exists, yet still rebuild it because its description is difficult to find. The immediate problem is not a lack of code. It is a discovery gap: engineers cannot confidently decide whether an existing asset fits the new project.

One cause is fragmented publication. Assets can be spread across projects and platforms, so a search returns partial results or repeated names. A second cause is incomplete context. An entry may show a name but not the capability, owner, version, conformance status, or instance health that a team needs before reuse. This uncertainty encourages another local implementation.

The operational risk is duplicated maintenance. When several teams create similar agents or APIs, a fix must be repeated and the organization may not know which asset is authoritative. The deeper implication is that unknown assets are harder to govern, monitor, or manage through their lifecycle.

Agent Registry offers a more disciplined path. Teams can search one inventory, publish assets for reuse, and inspect available status information. Scanners may discover agents, MCP servers, and APIs on demand or on a schedule. However, a registry is not a guarantee of safe reuse: teams should verify the record, ownership, conformance, and health before making a production decision. A catalogue becomes valuable when its information remains current and its users treat discovery as the first step, not the final approval.`;

const pilotFormBBody = `A team can apply an API policy correctly and still see a request behave differently from what an engineer expects. The immediate problem is an opaque enforcement result: a valid request may be rejected, while a single policy description does not explain the complete gateway behavior.

One cause is policy interaction. Gateway policies can enforce authentication, access, consumption, or service-level rules without changing application code, and the combined result depends on the policies in scope. A second cause is execution precedence. In Mule 4, policies can be ordered, but CORS is the documented exception that executes first. Header propagation is not automatic, and rate-limiting quota sharing is configurable.

The operational risk is brittle troubleshooting. An early rejection can make a later control appear to be the cause, while different teams may assume different defaults. The deeper implication is weaker security assurance: an undocumented combination can block legitimate traffic or leave an operator with the wrong explanation.

The prudent response is conditional. Teams should document the intended policy set, verify the gateway and policy versions, and test both accepted and rejected requests. They should inspect response details and logs when behavior differs from the expectation. A test result is evidence about that configuration, not proof that every gateway behaves identically. Central standards may reduce variation, but they should expand only as testing coverage and ownership accountability improve.`;

const pilotFormCBody = `A provider can publish a new API version and still find that consumers remain attached to an older contract. The immediate problem is a migration gap: the new option exists, but consumers cannot tell what changed, how long the old version will be supported, or which choice is safe for their integration.

One cause is confusion between versions. Exchange versions an asset with semantic versioning, while an API also has a consumer-facing API version defined by its provider. A second cause is incomplete lifecycle information. An asset version can move through development, stable, and deprecated states, but a number alone does not explain readiness, compatibility, or the next migration step.

The operational risk is maintenance overlap. Teams may keep patching several contracts and repeat the same compatibility analysis. The deeper implication is lower resilience: an unplanned migration can surface hidden dependencies during an incident or platform change.

The prudent response is conditional rather than abrupt. Providers should publish migration guidance, review the versions that consumers actually use, and communicate breaking changes before changing support expectations. A stable asset cannot simply be overwritten, so a meaningful change may require a new version. Deprecation is a lifecycle signal, not evidence that every consumer has migrated. Teams should increase formal deprecation only when consumer readiness, compatibility evidence, and ownership accountability are visible. Version management works when the catalog communicates both the version and the decision around it.`;

export const TECHNICAL_READING_TEXTS: Text[] = [
  {
    id: 'mulesoft-agent-registry-b1',
    title: 'MuleSoft Agent Registry: Reuse Before Rebuilding',
    body: agentRegistryBody,
    cefr_level: 'B1',
    genre: 'technical-ia',
    word_count: agentRegistryBody.trim().split(/\s+/).length,
    unique_words: new Set(agentRegistryBody.toLowerCase().match(/[a-z]+/g) ?? []).size,
    avg_sentence_length: Math.round(
      agentRegistryBody.trim().split(/\s+/).length
      / agentRegistryBody.split(/[.!?]+/).filter(Boolean).length,
    ),
    source: 'https://docs.mulesoft.com/general/agent-fabric-overview#agent-registry',
    is_authentic: false,
    key_vocabulary: [
      'registry',
      'inventory',
      'asset',
      'catalog',
      'conformance',
      'lifecycle',
      'scanner',
      'governance',
      'reuse',
    ],
    created_at: new Date(),
  },
  {
    id: 'mulesoft-runtime-policy-transfer-b1',
    title: 'MuleSoft Runtime Policies: Check the Effect Before Reuse',
    body: 'Runtime policies control what an API can do while it is running. A policy can require authentication, limit traffic, or record information for monitoring. The gateway applies the policy before a request reaches the backend. Teams should test normal and rejected requests. If a policy blocks valid traffic, logs and response details help engineers find the cause. A clear policy description makes reuse and troubleshooting easier.',
    cefr_level: 'B1',
    genre: 'technical-ia',
    word_count: 66,
    unique_words: 53,
    avg_sentence_length: 11,
    source: 'synthetic-transfer-probe',
    is_authentic: false,
    key_vocabulary: [
      'runtime',
      'policy',
      'authentication',
      'traffic',
      'monitoring',
      'gateway',
      'backend',
      'logs',
      'troubleshooting',
    ],
    created_at: new Date(),
  },
  makePilotText({
    id: 'mulesoft-pilot-registry-a-b1',
    title: 'Piloto A — Agent Registry y descubrimiento',
    body: pilotFormABody,
    parallel_form: 'A',
    key_vocabulary: ['discovery', 'inventory', 'asset', 'conformance', 'health', 'lifecycle', 'scanner', 'reuse'],
  }),
  makePilotText({
    id: 'mulesoft-pilot-policy-b-b1',
    title: 'Piloto B — Políticas y precedencia en gateway',
    body: pilotFormBBody,
    parallel_form: 'B',
    retest_only: true,
    key_vocabulary: ['policy', 'gateway', 'authentication', 'access', 'precedence', 'CORS', 'propagation', 'quota'],
  }),
  makePilotText({
    id: 'mulesoft-pilot-versioning-c-b1',
    title: 'Piloto C — Versiones y ciclo de vida de APIs',
    body: pilotFormCBody,
    parallel_form: 'C',
    retest_only: true,
    key_vocabulary: ['version', 'asset', 'semantic', 'lifecycle', 'stable', 'deprecated', 'migration', 'compatibility'],
  }),
];
