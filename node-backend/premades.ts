import IPremadeWorkspaces from '@shared/interface/IPremadeWorkspaces';

export const premades: IPremadeWorkspaces = {
  examples: [
    {
      title:
        'Antidepressants - single study B/R analysis (Tervonen et al, Stat Med, 2011)',
      key: 'nemeroff',
      type: 'example'
    },
    {
      title:
        'Antidepressants - relative effectiveness analysis (Van Valkenhoef et al, J Clin Epi, 2012)',
      key: 'hansen',
      type: 'example'
    },
    {
      title: 'GetReal course LU 4, activity 4.4',
      type: 'example',
      key: 'getreal'
    },
    {
      title: 'Thrombolytics - single study B/R analysis',
      key: 'thrombolytics',
      type: 'example'
    },
    {
      title: 'Zinbryta - initial regulatory review',
      key: 'zynbrita-initial',
      type: 'example'
    }
  ],
  tutorials: [
    {
      title: 'Lixisenatide simplified',
      key: 'lixisenatide-simplified',
      type: 'tutorial'
    },
    {
      title: 'Zinbryta initial assessment simplified',
      key: 'zynbritaSimplified',
      type: 'tutorial'
    },
    {
      title: 'Zinbryta initial assessment simplified, stochastic',
      key: 'zynbritaSimplifiedStochastic',
      type: 'tutorial'
    }
  ]
};
