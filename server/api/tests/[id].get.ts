import type { Test, Option } from '~/types/test'
import { bdcOptions, bdcQuestions } from '~~/server/utils/bdc-questions'
import { emotionalStabilityOptions, emotionalStabilityQuestions } from '~~/server/utils/emotional-stability-questions'
import { epqOptions, epqQuestions } from '~~/server/utils/epq-questions'
import { epqRscOptions, epqRscQuestions } from '~~/server/utils/epq-rsc-questions'
import { mbtiOptions, mbtiQuestions } from '~~/server/utils/mbti-questions'
import { sccsOptions, sccsQuestions } from '~~/server/utils/sccs-questions'
import { temperamentOptions, temperamentQuestions } from '~~/server/utils/temperament-questions'

// 通用的评分选项常量
const LIKERT_4_OPTIONS: Option[] = [
  { value: 0, label: '完全不会' },
  { value: 1, label: '好几天' },
  { value: 2, label: '一半以上天数' },
  { value: 3, label: '几乎每天' }
]

const LIKERT_5_OPTIONS: Option[] = [
  { value: 0, label: '从不' },
  { value: 1, label: '几乎不' },
  { value: 2, label: '有时' },
  { value: 3, label: '经常' },
  { value: 4, label: '非常频繁' }
]

// SCL-90 专用5点选项
const SCL_90_OPTIONS: Option[] = [
  { value: 1, label: '从无' },
  { value: 2, label: '很轻' },
  { value: 3, label: '中等' },
  { value: 4, label: '偏重' },
  { value: 5, label: '严重' }
]

// SDS 和 SAS 专用4点选项
const SDS_SAS_OPTIONS: Option[] = [
  { value: 1, label: '没有或很少时间' },
  { value: 2, label: '小部分时间' },
  { value: 3, label: '相当多时间' },
  { value: 4, label: '绝大部分或全部时间' }
]

// 快速生成题目
function createQuestion(id: number, text: string, options: Option[], reversed?: boolean, dimension?: string) {
  return {
    id,
    text,
    options,
    ...(reversed && { reversed }),
    ...(dimension && { dimension })
  }
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  const testDatabase: Record<string, Test> = {
    phq9: {
      id: 'phq9',
      title: 'PHQ-9 抑郁筛查量表',
      description: '在过去的两周里，您生活中以下症状出现的频率有多少？',
      instructions: '请根据您的实际情况，选择最符合您过去两周内感受的选项。',
      questions: [
        createQuestion(1, '做事时提不起劲或没有兴趣', LIKERT_4_OPTIONS),
        createQuestion(2, '感到心情低落、沮丧或绝望', LIKERT_4_OPTIONS),
        createQuestion(3, '入睡困难、睡不安稳或睡眠过多', LIKERT_4_OPTIONS),
        createQuestion(4, '感到疲倦或没有活力', LIKERT_4_OPTIONS),
        createQuestion(5, '食欲不振或吃太多', LIKERT_4_OPTIONS),
        createQuestion(6, '觉得自己很糟，或觉得自己很失败，或让自己或家人失望', LIKERT_4_OPTIONS),
        createQuestion(7, '对事物专注有困难，例如阅读报纸或看电视时', LIKERT_4_OPTIONS),
        createQuestion(8, '动作或说话速度缓慢到别人已经觉察？或正好相反，烦躁或坐立不安、动来动去的情况更胜平常', LIKERT_4_OPTIONS),
        createQuestion(9, '有不如死掉或用某种方式伤害自己的念头', LIKERT_4_OPTIONS)
      ],
      scoringRules: {
        type: 'sum',
        thresholds: [
          { min: 0, max: 4, level: '无显著抑郁症状', suggestion: '保持良好生活习惯' },
          { min: 5, max: 9, level: '轻度抑郁', suggestion: '建议关注心理健康' },
          { min: 10, max: 14, level: '中度抑郁', suggestion: '建议寻求专业帮助' },
          { min: 15, max: 19, level: '中重度抑郁', suggestion: '强烈建议咨询医生' },
          { min: 20, max: 27, level: '重度抑郁', suggestion: '请尽快寻求医疗帮助' }
        ]
      }
    },
    
    gad7: {
      id: 'gad7',
      title: 'GAD-7 焦虑筛查量表',
      description: '在过去的两周里，您被以下问题困扰的频率有多少？',
      instructions: '请根据您的实际情况，选择最符合您过去两周内感受的选项。',
      questions: [
        createQuestion(1, '感到紧张、焦虑或烦躁', LIKERT_4_OPTIONS),
        createQuestion(2, '无法停止或控制担忧', LIKERT_4_OPTIONS),
        createQuestion(3, '对各种事情过度担忧', LIKERT_4_OPTIONS),
        createQuestion(4, '难以放松', LIKERT_4_OPTIONS),
        createQuestion(5, '坐立不安，以至于难以安静地坐着', LIKERT_4_OPTIONS),
        createQuestion(6, '容易烦躁或急躁', LIKERT_4_OPTIONS),
        createQuestion(7, '感到害怕，好像有什么可怕的事情会发生', LIKERT_4_OPTIONS)
      ],
      scoringRules: {
        type: 'sum',
        thresholds: [
          { min: 0, max: 4, level: '轻度焦虑', suggestion: '建议学习放松技巧' },
          { min: 5, max: 9, level: '中度焦虑', suggestion: '建议寻求专业帮助' },
          { min: 10, max: 21, level: '重度焦虑', suggestion: '建议尽快咨询医生' }
        ]
      }
    },
    
    pss: {
      id: 'pss',
      title: '压力感知量表 (PSS-10)',
      description: '在过去的一个月里，您有多频繁地出现以下情况？',
      instructions: '请根据过去一个月您的真实感受，选择最符合的选项。注意：部分题目需要反向计分。',
      questions: [
        createQuestion(1, '因为发生意外的事情而感到心烦', LIKERT_5_OPTIONS),
        createQuestion(2, '感觉无法控制生活中重要的事情', LIKERT_5_OPTIONS),
        createQuestion(3, '感到紧张和压力', LIKERT_5_OPTIONS),
        createQuestion(4, '对自己处理个人问题的能力感到有信心（反向计分）', LIKERT_5_OPTIONS, true),
        createQuestion(5, '觉得事情都按照你的意愿发展（反向计分）', LIKERT_5_OPTIONS, true),
        createQuestion(6, '发现自己无法应对所有必须做的事情', LIKERT_5_OPTIONS),
        createQuestion(7, '能够控制生活中的恼人事情（反向计分）', LIKERT_5_OPTIONS, true),
        createQuestion(8, '觉得自己一切都很顺利（反向计分）', LIKERT_5_OPTIONS, true),
        createQuestion(9, '因为无法控制的事情而感到愤怒', LIKERT_5_OPTIONS),
        createQuestion(10, '感到困难堆积如山，无法克服', LIKERT_5_OPTIONS)
      ],
      scoringRules: {
        type: 'sum',
        thresholds: [
          { min: 0, max: 13, level: '压力水平较低', suggestion: '压力管理良好' },
          { min: 14, max: 26, level: '压力水平适中', suggestion: '建议学习压力管理' },
          { min: 27, max: 40, level: '压力水平较高', suggestion: '建议积极干预' }
        ]
      }
    },

    scl90: {
      id: 'scl90',
      title: 'SCL-90 症状自评量表',
      description: '以下列出了有些人可能会有的问题，请仔细阅读每一条，根据最近一星期以内您的实际感觉，选择最符合的选项。',
      instructions: '请根据您最近一周的真实感受，选择最符合的选项。该量表包含90个题目，大约需要15-20分钟完成。',
      questions: [
        createQuestion(1, '头痛', SCL_90_OPTIONS),
        createQuestion(2, '神经过敏，心中不踏实', SCL_90_OPTIONS),
        createQuestion(3, '头脑中有不必要的想法或字句盘旋', SCL_90_OPTIONS),
        createQuestion(4, '头晕或晕倒', SCL_90_OPTIONS),
        createQuestion(5, '对异性的兴趣减退', SCL_90_OPTIONS),
        createQuestion(6, '对旁人责备求全', SCL_90_OPTIONS),
        createQuestion(7, '感到别人能控制您的思想', SCL_90_OPTIONS),
        createQuestion(8, '责怪别人制造麻烦', SCL_90_OPTIONS),
        createQuestion(9, '忘记性大', SCL_90_OPTIONS),
        createQuestion(10, '担心自己的衣饰整齐及仪态的端正', SCL_90_OPTIONS),
        createQuestion(11, '容易烦恼和激动', SCL_90_OPTIONS),
        createQuestion(12, '胸痛', SCL_90_OPTIONS),
        createQuestion(13, '害怕空旷的场所或街道', SCL_90_OPTIONS),
        createQuestion(14, '感到自己精力下降，活动减慢', SCL_90_OPTIONS),
        createQuestion(15, '想结束自己的生命', SCL_90_OPTIONS),
        createQuestion(16, '听到旁人听不到的声音', SCL_90_OPTIONS),
        createQuestion(17, '发抖', SCL_90_OPTIONS),
        createQuestion(18, '感到大多数人都不可信任', SCL_90_OPTIONS),
        createQuestion(19, '胃口不好', SCL_90_OPTIONS),
        createQuestion(20, '容易哭泣', SCL_90_OPTIONS),
        createQuestion(21, '同异性相处时感到害羞不自在', SCL_90_OPTIONS),
        createQuestion(22, '感到受骗，中了圈套或有人想抓住您', SCL_90_OPTIONS),
        createQuestion(23, '无缘无故地突然感到害怕', SCL_90_OPTIONS),
        createQuestion(24, '自己不能控制地大发脾气', SCL_90_OPTIONS),
        createQuestion(25, '怕单独出门', SCL_90_OPTIONS),
        createQuestion(26, '经常责怪自己', SCL_90_OPTIONS),
        createQuestion(27, '腰痛', SCL_90_OPTIONS),
        createQuestion(28, '感到难以完成任务', SCL_90_OPTIONS),
        createQuestion(29, '感到孤独', SCL_90_OPTIONS),
        createQuestion(30, '感到苦闷', SCL_90_OPTIONS),
        createQuestion(31, '过分担忧', SCL_90_OPTIONS),
        createQuestion(32, '对事物不感兴趣', SCL_90_OPTIONS),
        createQuestion(33, '感到害怕', SCL_90_OPTIONS),
        createQuestion(34, '您的感情容易受到伤害', SCL_90_OPTIONS),
        createQuestion(35, '旁人能知道您的私下想法', SCL_90_OPTIONS),
        createQuestion(36, '感到别人不理解您或不同情您', SCL_90_OPTIONS),
        createQuestion(37, '感到人们对您不友好，不喜欢您', SCL_90_OPTIONS),
        createQuestion(38, '做事必须做得很慢以保证做得正确', SCL_90_OPTIONS),
        createQuestion(39, '心跳得很厉害', SCL_90_OPTIONS),
        createQuestion(40, '恶心或胃部不舒服', SCL_90_OPTIONS),
        createQuestion(41, '感到比不上他人', SCL_90_OPTIONS),
        createQuestion(42, '肌肉酸痛', SCL_90_OPTIONS),
        createQuestion(43, '感到有人在监视您、谈论您', SCL_90_OPTIONS),
        createQuestion(44, '难以入睡', SCL_90_OPTIONS),
        createQuestion(45, '做事必须反复检查', SCL_90_OPTIONS),
        createQuestion(46, '难以作出决定', SCL_90_OPTIONS),
        createQuestion(47, '怕乘电车、公共汽车、地铁或火车', SCL_90_OPTIONS),
        createQuestion(48, '呼吸有困难', SCL_90_OPTIONS),
        createQuestion(49, '一阵阵发冷或发热', SCL_90_OPTIONS),
        createQuestion(50, '因为感到害怕而避开某些东西、场合或活动', SCL_90_OPTIONS),
        createQuestion(51, '脑子变空了', SCL_90_OPTIONS),
        createQuestion(52, '身体发麻或刺痛', SCL_90_OPTIONS),
        createQuestion(53, '喉咙有梗塞感', SCL_90_OPTIONS),
        createQuestion(54, '感到前途没有希望', SCL_90_OPTIONS),
        createQuestion(55, '不能集中注意力', SCL_90_OPTIONS),
        createQuestion(56, '感到身体的某一部分软弱无力', SCL_90_OPTIONS),
        createQuestion(57, '感到紧张或容易紧张', SCL_90_OPTIONS),
        createQuestion(58, '感到手或脚发重', SCL_90_OPTIONS),
        createQuestion(59, '想到死亡的事', SCL_90_OPTIONS),
        createQuestion(60, '吃得太多', SCL_90_OPTIONS),
        createQuestion(61, '当别人看着您或谈论您时感到不自在', SCL_90_OPTIONS),
        createQuestion(62, '有一些不属于您自己的想法', SCL_90_OPTIONS),
        createQuestion(63, '有想打人或伤害他人的冲动', SCL_90_OPTIONS),
        createQuestion(64, '醒得太早', SCL_90_OPTIONS),
        createQuestion(65, '必须反复洗手、点数', SCL_90_OPTIONS),
        createQuestion(66, '睡得不稳不深', SCL_90_OPTIONS),
        createQuestion(67, '有想摔坏或破坏东西的冲动', SCL_90_OPTIONS),
        createQuestion(68, '有一些别人没有的想法或念头', SCL_90_OPTIONS),
        createQuestion(69, '感到对别人神经过敏', SCL_90_OPTIONS),
        createQuestion(70, '在商店或电影院等人多的地方感到不自在', SCL_90_OPTIONS),
        createQuestion(71, '感到任何事情都很困难', SCL_90_OPTIONS),
        createQuestion(72, '一阵阵恐惧或惊恐', SCL_90_OPTIONS),
        createQuestion(73, '感到在公共场合吃东西很不舒服', SCL_90_OPTIONS),
        createQuestion(74, '经常与人争论', SCL_90_OPTIONS),
        createQuestion(75, '单独一人时神经很紧张', SCL_90_OPTIONS),
        createQuestion(76, '别人对您的成绩没有作出恰当的评价', SCL_90_OPTIONS),
        createQuestion(77, '即使和别人在一起也感到孤单', SCL_90_OPTIONS),
        createQuestion(78, '感到坐立不安心神不定', SCL_90_OPTIONS),
        createQuestion(79, '感到自己没有什么价值', SCL_90_OPTIONS),
        createQuestion(80, '感到熟悉的东西变成陌生或不像是真的', SCL_90_OPTIONS),
        createQuestion(81, '大叫或摔东西', SCL_90_OPTIONS),
        createQuestion(82, '害怕会在公共场合昏倒', SCL_90_OPTIONS),
        createQuestion(83, '感到别人想占您的便宜', SCL_90_OPTIONS),
        createQuestion(84, '为一些有关性的想法而很苦恼', SCL_90_OPTIONS),
        createQuestion(85, '您认为应该因为自己的过错而受到惩罚', SCL_90_OPTIONS),
        createQuestion(86, '感到要很快把事情做完', SCL_90_OPTIONS),
        createQuestion(87, '感到自己的身体有严重问题', SCL_90_OPTIONS),
        createQuestion(88, '从未感到和其他人很亲近', SCL_90_OPTIONS),
        createQuestion(89, '感到自己有罪', SCL_90_OPTIONS),
        createQuestion(90, '感到自己的脑子有毛病', SCL_90_OPTIONS)
      ],
      scoringRules: {
        type: 'scl90',
        thresholds: [
          { min: 90, max: 179, level: '心理健康状况良好', suggestion: '您的心理健康状况良好，请继续保持健康的生活方式。' },
          { min: 180, max: 224, level: '轻度心理困扰', suggestion: '您可能存在轻度心理困扰，建议关注自我调适，适当放松。' },
          { min: 225, max: 269, level: '中度心理困扰', suggestion: '您的心理困扰程度中等，建议寻求专业心理咨询帮助。' },
          { min: 270, max: 450, level: '重度心理困扰', suggestion: '您的心理困扰较明显，强烈建议尽快寻求专业心理医生帮助。' }
        ]
      }
    },

    sds: {
      id: 'sds',
      title: '抑郁自评量表 (SDS)',
      description: '请根据您过去一周的实际感觉，选择最符合的选项。',
      instructions: '请仔细阅读每一条题目，根据您过去一周的实际感觉选择最符合的选项。注意：部分题目需要反向计分。',
      questions: [
        createQuestion(1, '我觉得闷闷不乐，情绪低沉', SDS_SAS_OPTIONS),
        createQuestion(2, '我觉得一天中早晨最好（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(3, '我一阵阵哭出来或觉得想哭', SDS_SAS_OPTIONS),
        createQuestion(4, '我晚上睡眠不好', SDS_SAS_OPTIONS),
        createQuestion(5, '我吃得跟平常一样多（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(6, '我与异性密切接触时和以往一样感到愉快（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(7, '我发觉我的体重在下降', SDS_SAS_OPTIONS),
        createQuestion(8, '我有便秘的苦恼', SDS_SAS_OPTIONS),
        createQuestion(9, '我心跳比平时快', SDS_SAS_OPTIONS),
        createQuestion(10, '我无缘无故地感到疲乏', SDS_SAS_OPTIONS),
        createQuestion(11, '我的头脑跟平常一样清楚（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(12, '我觉得经常做的事情并没有困难（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(13, '我觉得不安而平静不下来', SDS_SAS_OPTIONS),
        createQuestion(14, '我对将来抱有希望（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(15, '我比平常容易生气激动', SDS_SAS_OPTIONS),
        createQuestion(16, '我觉得作出决定是容易的（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(17, '我觉得自己是个有用的人，有人需要我（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(18, '我的生活过得很有意思（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(19, '我认为如果我死了，别人会生活得好些', SDS_SAS_OPTIONS),
        createQuestion(20, '平常感兴趣的事我仍然感兴趣（反向计分）', SDS_SAS_OPTIONS, true)
      ],
      scoringRules: {
        type: 'sds'
      }
    },

    sas: {
      id: 'sas',
      title: '焦虑自评量表 (SAS)',
      description: '请根据您过去一周的实际感觉，选择最符合的选项。',
      instructions: '请仔细阅读每一条题目，根据您过去一周的实际感觉选择最符合的选项。注意：部分题目需要反向计分。',
      questions: [
        createQuestion(1, '我觉得比平常容易紧张和着急', SDS_SAS_OPTIONS),
        createQuestion(2, '我无缘无故地感到害怕', SDS_SAS_OPTIONS),
        createQuestion(3, '我容易心里烦乱或觉得惊恐', SDS_SAS_OPTIONS),
        createQuestion(4, '我觉得我可能将要发疯', SDS_SAS_OPTIONS),
        createQuestion(5, '我觉得一切都很好，也不会发生什么不幸（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(6, '我手脚发抖打颤', SDS_SAS_OPTIONS),
        createQuestion(7, '我因为头痛、颈痛和背痛而苦恼', SDS_SAS_OPTIONS),
        createQuestion(8, '我感觉容易衰弱和疲乏', SDS_SAS_OPTIONS),
        createQuestion(9, '我觉得心平气和，并且容易安静坐着（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(10, '我觉得心跳得很快', SDS_SAS_OPTIONS),
        createQuestion(11, '我因为一阵阵头晕而苦恼', SDS_SAS_OPTIONS),
        createQuestion(12, '我有晕倒发作，或觉得要晕倒似的', SDS_SAS_OPTIONS),
        createQuestion(13, '我吸气呼气都感到很容易（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(14, '我手脚麻木和刺痛', SDS_SAS_OPTIONS),
        createQuestion(15, '我因为胃痛和消化不良而苦恼', SDS_SAS_OPTIONS),
        createQuestion(16, '我常常要小便', SDS_SAS_OPTIONS),
        createQuestion(17, '我的手常常是干燥温暖的（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(18, '我脸红发热', SDS_SAS_OPTIONS),
        createQuestion(19, '我容易入睡并且一夜睡得很好（反向计分）', SDS_SAS_OPTIONS, true),
        createQuestion(20, '我做恶梦', SDS_SAS_OPTIONS)
      ],
      scoringRules: {
        type: 'sas'
      }
    },
    
    mbti: {
    id: 'mbti',
    title: 'MBTI 人格测试',
    description: '本测试基于荣格的心理类型理论，帮助您了解自己在四个维度上的偏好。',
    instructions: '请根据您的真实情况和第一反应选择最符合的选项。每个题目没有对错之分，请选择最贴近您日常行为的描述。共93题，大约需要12-15分钟。',
    questions: mbtiQuestions.map(q => ({
      id: q.id,
      text: q.text,
      options: mbtiOptions,
      dimension: q.dimension,
      reversed: q.reverse
    })),
    scoringRules: {
      type: 'mbti'
    }
  },
  sccs: {
  id: 'sccs',
  title: '自我和谐量表',
  description: '本量表用于评估您自我与经验的关系，了解您的内心和谐程度。',
  instructions: '请根据您的实际情况，选择最符合您感受的选项。共35题，大约需要8-10分钟。',
  questions: sccsQuestions.map(q => ({
    id: q.id,
    text: q.text,
    options: sccsOptions,
    dimension: q.dimension,
    reversed: q.reverse
  })),
  scoringRules: {
    type: 'sccs'
  }
},
temperament: {
  id: 'temperament',
  title: '气质类型测试',
  description: '本测试基于古希腊医生希波克拉底的四液说，帮助您了解自己的气质类型。',
  instructions: '请根据您的真实情况选择最符合的选项。共60题，大约需要10-15分钟。每题有5个选项：很符合、较符合、一般、较不符合、很不符合。',
  questions: temperamentQuestions.map(q => ({
    id: q.id,
    text: q.text,
    options: temperamentOptions,
    dimension: q.dimension
  })),
  scoringRules: {
    type: 'temperament'
  }
},
bdc: {
  id: 'bdc',
  title: '伯恩斯抑郁症清单',
  description: '本量表由美国心理治疗专家David D. Burns博士设计，用于快速评估您的抑郁情绪程度。',
  instructions: '请根据您过去一周（包括今天）的真实感受，选择最符合的选项。每题有4个选项：没有、轻度、中度、严重。共15题，大约需要3-5分钟。',
  questions: bdcQuestions.map(q => ({
    id: q.id,
    text: q.text,
    options: bdcOptions
  })),
  scoringRules: {
    type: 'bdc'
  }
},
epq: {
  id: 'epq',
  title: '艾森克人格问卷',
  description: '本问卷由英国心理学家艾森克编制，是国际上广泛使用的人格测量工具。',
  instructions: '请根据您的真实情况回答下列问题。每个问题都有"是"和"否"两个选项，请选择最符合您的选项。共88题，大约需要15-20分钟。',
  questions: epqQuestions.map(q => ({
    id: q.id,
    text: q.text,
    options: epqOptions,
    scale: q.scale,
    reversed: q.reverse
  })),
  scoringRules: {
    type: 'epq'
  }
},
'epq-rsc': {
  id: 'epq-rsc',
  title: '艾森克人格问卷简式量表',
  description: '本问卷由北京大学钱铭怡教授等修订，是EPQ的中国版简式量表，共48题。',
  instructions: '请回答下列问题。回答"是"时，就在"是"上打"√"；回答"否"时就在"否"上打"√"。每个答案无所谓正确与错误。请尽快回答，不要在每道题目上太多思索。回答时不要考虑应该怎样，只回答你平时是怎样的。每题都要回答。共48题，大约需要10-15分钟。',
  questions: epqRscQuestions.map(q => ({
    id: q.id,
    text: q.text,
    options: epqRscOptions,
    scale: q.scale,
    reversed: q.reverse
  })),
  scoringRules: {
    type: 'epq-rsc'
  }
},
'emotional-stability': {
  id: 'emotional-stability',
  title: '情绪稳定性测试',
  description: '本测试用于测量您的情绪稳定性程度，帮助了解自己的情绪特点和抗压能力。',
  instructions: '请根据您的实际情况，做出回答。符合的，则选择“是”；难以回答的，则选择“？”；不符合的，选择“否”。做这个测验不必多思考，请用10分钟左右的时间完成，每题只能选择一个答案。',
  questions: emotionalStabilityQuestions.map(q => ({
    id: q.id,
    text: q.text,
    options: emotionalStabilityOptions
  })),
  scoringRules: {
    type: 'emotional-stability'
  }
}
  }
  
  const test = testDatabase[id as string]
  if (!test) {
    throw createError({
      statusCode: 404,
      statusMessage: '测评不存在',
      message: `未找到ID为 ${id} 的测评`
    })
  }
  
  return {
    success: true,
    data: test
  }
})