import IHelpInfo from './IHelpInfo';

export const lexicon: Record<string, IHelpInfo> = {
  'add-subproblem': {
    title: 'Adding a new problem',
    text:
      'Here you can define a new problem as a subset of all evidence (by excluding criteria and alternatives), and with different scale ranges.',
    link: '/manual.html#mcda-problem-definition'
  },
  alternative: {
    title: 'Alternative',
    text:
      'An alternative is one of the different options for treatment/intervention being explored in a benefit-risk analysis, e.g. "aspirin 40 mg/day" or "meditation therapy".',
    link: '/manual.html#mcda-manual-entry'
  },
  'analysis-type': {
    title: 'Analysis type',
    text:
      'Choose whether to display Deterministic (effects) or SMAA (distribution) values',
    link: '/manual.html#'
  },
  'central-weights': {
    title: 'Central weights',
    text:
      'The typical weights that would make an alternative the highest ranked treatment.',
    link: '/manual.html#mcda-smaa-analysis'
  },
  'central-weights-table': {
    title: 'Central weights table',
    text:
      'Table with the central weights and confidence factors for each alternative. For alternatives with empty rows, there was not a single combination of sampled weights and criteria measurements that made this alternative the preferered treatment. These alternatives therefore do not have a central weight vector.',
    link: '/manual.html#mcda-smaa-analysis'
  },
  'confidence-factor': {
    title: 'Confidence factor',
    text:
      "The probability that an alternative is the highest ranked treatment if that alternative's central weight vector is used to rank the alternatives.",
    link: '/manual.html#mcda-smaa-analysis'
  },
  'configured-range': {
    title: 'Configured range',
    text:
      'Which range the user has actually configured to be used. Without user intervention the default scales are the observed ranges.',
    link: '/manual.html#mcda-preparing-dataset'
  },
  criterion: {
    title: 'Criterion',
    text:
      'A criterion is an outcome of interest to be used in a benefit-risk analysis, e.g. "mood improvement" or "nausea".',
    link: '/manual.html#mcda-manual-entry'
  },
  reference: {
    title: 'Reference',
    text:
      'An optional indication of where the data for this criterion comes from.',
    link: '/manual.html#mcda-manual-entry'
  },
  'criterion-source-link': {
    title: 'Reference URL',
    text:
      "An optional hyperlink that leads to the source of this criterion's data. This link should start with http:// or https://",
    link: '/manual.html#mcda-manual-entry'
  },
  'unit-of-measurement': {
    title: 'Unit of measurement',
    text:
      'In which unit of measurement the criterion\'s data are reported (e.g. "proportion", "gram")',
    link: '/manual.html#mcda-manual-entry'
  },
  'deterministic-analysis-results': {
    title: 'Deterministic analysis results',
    text:
      'This section shows the results of deterministic analysis (representative weights, total value), allows for sensitivity analysis, and allows modification of the effects table to explore the problem space.',
    link: '/manual.html#mcda-deterministic-analysis'
  },
  'effects-table': {
    title: 'Effects table',
    text:
      'The effects table shows the size of the effects on each criterion for each alternative. In the case of a known distribution of an effect the values shown are the median value and the 95% credible interval. If the effect is an exact distribution value only that value is shown.',
    link: '/manual.html#mcda-running-example'
  },
  favorability: {
    title: 'Favorability',
    text: 'Whether or not an increase in the criterion is seen as favorable.',
    link: '/manual.html#mcda-manual-entry'
  },
  importance: {
    title: 'Importance',
    text:
      'The importance of the criterion. A higher percentage means the criterion is more important.',
    link: '/manual.html#mcda-value-tradeoffs'
  },
  'imprecise-matching': {
    title: 'Imprecise Matching',
    text:
      "Elicitation of the user's weight trade-offs between the different criteria, via the interval method. This method allows specification of an interval (rather than an exact value) where changes to two criteria are equivalent. This results in weight ratios between all the criteria, e.g. increasing effectiveness by 5-10% is equally desirable to decreasing mortality by 10-20%.",
    link: '/manual.html#mcda-value-tradeoffs'
  },
  'incomplete-workspaces': {
    title: 'Incomplete workspaces',
    text:
      'The process of manually creating a workspace can be paused at any point. This list shows those unfinished workspaces.',
    link: '/manual.html#mcda-preparing-dataset'
  },
  matching: {
    title: 'Matching',
    text:
      'Elicitation of the criteria weights through a series of matching questions. This method sets weights by asking users to specify how much the performance with respect to one criterion needs to improve to compensate for a worsening in the performance with respect to another criterion.',
    link: '/manual.html#mcda-value-tradeofffs'
  },
  'measurements-display-mode': {
    title: 'Measurements display mode',
    text:
      'Choose whether to display the input values of the effects table or the values used for calculation during the analysis',
    link: '/manual.html#'
  },
  'measurements-smaa-uncertainty': {
    title: 'Uncertainty in measurements',
    text:
      'Some measurements may include uncertainty, usually expressed as a confidence interval. SMAA can take this uncertainty into account when calculating the rank acceptiblities.',
    link: '/manual.html#mcda-smaa-analysis'
  },
  'median-mode': {
    title: 'Median and mode selection',
    text:
      'Choose whether the median or the mode should be displayed when looking to the SMAA analysis values in the effects table. Mode values are informative only and will not be used while calculation analysis results.',
    link: '/manual.html#mcda-smaa-analysis'
  },
  'observed-range': {
    title: 'Observed range',
    text:
      'The observed range within which all the effects of a given analysis lie. The lower bound is the lowest among the effects (or of their low end of the 95% CrI in the case of non-exact effect distributions). The upper bound is the maximum of these values.',
    link: '/manual.html#mcda-value-tradeoffs'
  },
  'one-way-sensitivity-analysis': {
    title: 'One-way sensitivity analysis',
    text:
      'A section that allows exploring of the sensitivity of the results by allowing only one thing to change.',
    link: '/manual.html#mcda-deterministic-analysis'
  },
  'partial-value-function': {
    title: 'Partial Value Function',
    text:
      "A partial value function indicates how the desirability of a criterion's outcome varies with its value.",
    link: 'manual.html#mcda-mavt'
  },
  percentages: {
    title: 'Percentages',
    text:
      'Choose whether to display percentages or decimals for applicable effect table values.',
    link: 'manual.html#'
  },
  problem: {
    title: 'Problem definition',
    text:
      'The problem definition is a lens through which to view the data for analysis. Criteria and alternatives can be omitted, and scale ranges can be changed.',
    link: '/manual.html#mcda-problem-definition'
  },
  'pvf-type': {
    title: 'Type of partial value function',
    text:
      'Partial value functions can be either linear (a straight line between two points) or piece-wise linear, meaning the function consists of several linear segments.',
    link: '/manual.html#mcda-value-tradeoffs'
  },
  'random-seed': {
    title: 'Random seed',
    text: 'The random seed that is used in R calculations.',
    link: '/manual.html#mcda-benefit-risk-analysis'
  },
  'rank-acceptabilities': {
    title: 'Rank acceptabilities',
    text:
      'How likely each intervention is to overall be the best, worst, or any rank in between, based on the SMAA model results for the given preferences and data.',
    link: '/manual.html#mcda-benefit-risk-analysis'
  },
  ranking: {
    title: 'Ranking',
    text:
      'The ranking of the criteria according to their relative importance. The lower the number, the more important the criterion.',
    link: '/manual.html#mcda-value-tradeoffs'
  },
  'representative-weights': {
    title: 'Weights',
    text:
      'Weights representative of how important each criterion is. The total weights add up to one.',
    link: '/manual.html#mcda-deterministic-analysis'
  },
  'scale-ranges': {
    title: 'Scale ranges',
    text:
      'For each criterion there is a theoretical maximum range within which the effects may lie (infinite for continuous criteria, between zero and one), as well as a minimum range (determined by the effects). In most cases only a portion of this range is actually relevant to the data. Here you can adjust these scales to your liking.',
    link: '/manual.html#mcda-value-tradeoffs'
  },
  scenario: {
    title: 'Scenario',
    text:
      'A scenario is a collection of preferences to feed into the MCDA models. This consists of a partial value function for each criterion, and an optional set of weight preferences (swing weighting, ranking, exact matching or imprecise matching).',
    link: '/manual.html#mcda-scenarios'
  },
  'sensitivity-measurements': {
    title: 'Measurements sensitivity analysis',
    text:
      "How the value of a specific alternative changes as the weight of a specific criterion changes between 0 and 1. All other alternatives' values are kept constant at the current default for comparison.",
    link: '/manual.html#mcda-deterministic-analysis'
  },
  'sensitivity-preferences': {
    title: 'Preferences sensitivity analysis',
    text:
      'How the value of all alternatives changes as the weight of a specific criterion changes between 0 and 1.',
    link: '/manual.html#mcda-deterministic-analysis'
  },
  'smaa-results': {
    title: 'SMAA results',
    text:
      'The results of stochastic multicriteria acceptability analysis (SMAA) for the given preferences.',
    link: '/manual.html#mcda-value-tradeoffs'
  },
  'strength-of-evidence': {
    title: 'Strength of evidence',
    text:
      'Statements regarding the strength of evidence of the treatment effect estimates displayed in a row of the effects table.',
    link: '/manual.html#mcda-running-example'
  },
  'swing-weighting': {
    title: 'Swing Weighting',
    text:
      "Elicitation of the user's weight trade-offs between the different criteria using swing weighting. This method sets weights by choosing one criterion as most important to be improved, and allows the user to scale the other criteria accordingly.",
    link: '/manual.html#mcda-value-tradeoffs'
  },
  'therapeutic-context': {
    title: 'Therapeutic context',
    text:
      'Background information about the context in which the data should be interpreted, e.g. information about studies or meta-analyses from which the data comes.',
    link: '/manual.html#mcda-manual-entry'
  },
  'theoretical-range': {
    title: 'Theoretical range',
    text: 'The theoretically maximal range in which effect sizes can lie',
    link: '/manual.html#mcda-value-tradeoffs.'
  },
  'toggled-columns': {
    title: 'Toggled columns',
    text: 'Select which columns to show/hide in the effects table.',
    link: '/manual.html#'
  },
  'total-value': {
    title: 'Total value',
    text:
      'How valuable (i.e. helpful for each criterion) each alternative is overall.',
    link: '/manual.html#deterministic-results'
  },
  treatment: {
    title: 'Treatment',
    text:
      'A treatment is an intervention of interest to be used in a benefit-risk analysis, e.g. "Aspirin 20 mg/day" or "Meditation".',
    link: '/manual.html#mcda-preparing-dataset'
  },
  uncertainties: {
    title: 'Uncertainties',
    text:
      'Any uncertainties regarding the treatment effect estimates displayed in a row of the effects table.',
    link: '/manual.html#mcda-running-example'
  },
  'value-profiles': {
    title: 'Value profiles',
    text:
      'How the total value of each alternative is composed out of its value for each criterion.',
    link: '/manual.html#deterministic-results'
  },
  weights: {
    title: 'Weights',
    text:
      'Weights indicate how much importance the user places on improving each criterion. Weights can be specified directly through swing weighting. Alternatively, they can be derived through a series of ranking and matching questions.',
    link: '/manual.html#mcda-value-tradeoffs'
  },
  'weights-smaa-uncertainty': {
    title: 'Uncertainty in weights',
    text:
      'Some preference scenarios may include uncertainty for example when alternatives are ranked, or no preference is expressed. SMAA can take this uncertainty into account when calculating the rank acceptiblities.',
    link: '/manual.html#mcda-smaa-analysis'
  },
  workspace: {
    title: 'Workspace',
    text:
      'A workspace contains your base data, and any definitions you have based thereon, i.e. subselections of criteria and interventions (subproblems) and sets of preferences (scenarios).',
    link: '/manual.html#mcda-preparing-dataset'
  }
};
