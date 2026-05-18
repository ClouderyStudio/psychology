import type { TestListItem } from '~/types/test'

export default defineEventHandler(() => {
  const testList: TestListItem[] = [
    {
      id: 'phq9',
      title: 'PHQ-9 抑郁筛查量表',
      englishName: 'Patient Health Questionnaire-9',
      description: '用于评估过去两周内的抑郁症状严重程度，包含9个核心问题',
      duration: '约3-5分钟',
      questionsCount: 9,
      category: 'symptom'
    },
    {
      id: 'gad7',
      title: 'GAD-7 焦虑筛查量表',
      englishName: 'Generalized Anxiety Disorder-7',
      description: '用于评估广泛性焦虑症状的严重程度，快速识别焦虑倾向',
      duration: '约2-3分钟',
      questionsCount: 7,
      category: 'symptom'
    },
    {
      id: 'pss',
      title: '压力感知量表',
      englishName: 'Perceived Stress Scale (PSS-10)',
      description: '用于评估您在过去一个月中的压力感知水平，了解压力管理需求',
      duration: '约4-6分钟',
      questionsCount: 10,
      category: 'symptom'
    },
    {
      id: 'scl90',
      title: 'SCL-90 症状自评量表',
      englishName: 'Symptom Checklist-90',
      description: '全面的心理健康评估工具，评估9个维度的心理症状，专业详尽',
      duration: '约15-20分钟',
      questionsCount: 90,
      category: 'symptom'
    },
    {
      id: 'sds',
      title: '抑郁自评量表',
      englishName: 'Self-Rating Depression Scale (SDS)',
      description: '标准化的抑郁症状自评工具，帮助了解抑郁倾向程度',
      duration: '约5-8分钟',
      questionsCount: 20,
      category: 'symptom'
    },
    {
      id: 'sas',
      title: '焦虑自评量表',
      englishName: 'Self-Rating Anxiety Scale (SAS)',
      description: '标准化的焦虑症状自评工具，快速评估焦虑水平',
      duration: '约5-8分钟',
      questionsCount: 20,
      category: 'symptom'
    },
    {
      id: 'mbti',
      title: 'MBTI 人格测试',
      englishName: 'Myers-Briggs Type Indicator',
      description: '基于荣格心理学理论，评估16种人格类型，帮助了解性格倾向和偏好',
      duration: '约12-15分钟',
      questionsCount: 93,
      category: 'personality'
    },
    {
      id: 'sccs',
      title: '自我和谐量表',
      englishName: 'Self-Consistency and Congruence Scale (SCCS)',
      description: '评估自我与经验的关系，了解内心和谐程度，包含35个问题',
      duration: '约8-10分钟',
      questionsCount: 35,
      category: 'special'
    },
    {
      id: 'temperament',
      title: '气质类型测试',
      englishName: 'Temperament Type Test',
      description: '基于希波克拉底的四液说，评估胆汁质、多血质、粘液质、抑郁质四种气质类型',
      duration: '约10-15分钟',
      questionsCount: 60,
      category: 'special'
    },
    {
      id: 'bdc',
      title: '伯恩斯抑郁症清单',
      englishName: 'Burns Depression Checklist (BDC)',
      description: '美国心理治疗专家David D. Burns博士设计的抑郁症自我诊断表，帮助快速评估抑郁情绪程度',
      duration: '约3-5分钟',
      questionsCount: 15,
      category: 'symptom'
    },
    {
      id: 'epq',
      title: '艾森克人格问卷',
      englishName: 'Eysenck Personality Questionnaire (EPQ)',
      description: '英国心理学家艾森克编制的人格测量工具，测评内外向、情绪稳定性、精神质三个维度',
      duration: '约15-20分钟',
      questionsCount: 88,
      category: 'personality'
    },
    {
      id: 'epq-rsc',
      title: '艾森克人格问卷简式量表',
      englishName: 'Eysenck Personality Questionnaire Revised Short Scale (EPQ-RSC)',
      description: '北京大学钱铭怡教授等修订的中国版艾森克人格问卷简式版，评估内外向(E)、神经质(N)、精神质(P)、掩饰性(L)四个维度',
      duration: '约10-15分钟',
      questionsCount: 48,
      category: 'personality'
    },
    {
      id: 'emotional-stability',
      title: '情绪稳定性测试',
      englishName: 'Emotional Stability Test',
      description: '评估您的情绪稳定程度，了解情绪波动情况和心理抗压能力',
      duration: '约5-10分钟',
      questionsCount: 30,
      category: 'special'
    }
  ]
  
  return {
    success: true,
    data: testList
  }
})