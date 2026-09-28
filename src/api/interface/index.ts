/** 通用 API 响应结构 */
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg?: string;
}

// 请求响应参数（不包含data）
export interface Result {
  code: number;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  curPage: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  curPage?: number;
  pageSize?: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    code?: string;
    password?: string;
    phone?: string;
    uuid?: string;
  }
  export interface CaptchaResponse {
    code?: string;
    image?: string;
    uuid?: string;
  }
  export interface DeptVO {
    children?: DeptVO[];
    createTime?: Date;
    enabled?: boolean;
    hasChildren?: boolean;
    id?: number;
    name?: string;
    parentId?: number;
    parentName?: string;
    sort?: number;
    updateTime?: Date;
    [property: string]: any;
  }
  export interface RoleVO {
    code?: string;
    createTime?: Date;
    description?: string;
    enabled?: boolean;
    id?: number;
    menuIds?: number[];
    name?: string;
    updateTime?: Date;
  }
  export interface SaTokenInfo {
    isLogin?: boolean;
    loginDevice?: string;
    loginId?: { [key: string]: any };
    loginType?: string;
    sessionTimeout?: number;
    tag?: string;
    tokenActiveTimeout?: number;
    tokenName?: string;
    tokenSessionTimeout?: number;
    tokenTimeout?: number;
    tokenValue?: string;
    [property: string]: any;
  }
  export interface CompanyInfo {
    isLogin?: boolean;
    loginDevice?: string;
    loginId?: { [key: string]: any };
    loginType?: string;
    sessionTimeout?: number;
    tag?: string;
    tokenActiveTimeout?: number;
    tokenName?: string;
    tokenSessionTimeout?: number;
    tokenTimeout?: number;
    tokenValue?: string;
    [property: string]: any;
  }
  export interface ResLogin {
    createBy?: number;
    createTime?: Date;
    currentDeptId?: number;
    currentRoleId?: number;
    deleted?: boolean;
    depts?: DeptVO[];
    enabled?: boolean;
    id?: number;
    lastLoginTime?: Date;
    nickname?: string;
    openId?: string;
    permissions?: string[];
    phone?: string;
    roles?: RoleVO[];
    sort?: number;
    tokenInfo?: SaTokenInfo;
    companyInfo?: CompanyInfo;
    unionId?: string;
    updateBy?: number;
    updateTime?: Date;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  /**
   * ChangePasswdDTO
   */
  export interface ChangePasswd {
    /**
     * 新密码
     */
    newPasswd: string;
    /**
     * 旧密码
     */
    oldPasswd: string;
    [property: string]: any;
  }
}

export interface Enumeration {
  dictType: string;
  value: string;
  label: string;
  colorType: string;
  cssClass: string;
}

export interface AreaRequest {
  /**
   * 开始日期（yyyy-MM-dd）
   */
  beginDate?: Date;
  /**
   * 当前页数（仅对分页有效）
   */
  curPage?: number;
  /**
   * 结束日期（yyyy-MM-dd）
   */
  endDate?: Date;
  /**
   * 区域名称
   */
  name?: string;
  /**
   * 每页数量（仅对分页有效）
   */
  pageSize?: number;
  /**
   * 父级id
   */
  pid?: number;
  /**
   * 是否升序
   */
  sorts0Asc?: boolean;
  /**
   * 字段名
   */
  sorts0Field?: string;
  [property: string]: any;
}

// 企业信息
export namespace Enterprise {
  /**
   * CompanyInfoVO对象，企业基本信息表
   */
  export interface CompanyInfoVO {
    /**
     * 规模以上企业认证状态
     */
    aboveScaleCertStatus?: string;
    /**
     * 地址
     */
    address?: string;
    /**
     * 行业大类
     */
    bindustry?: string;
    /**
     * 工商审核状态
     */
    bizAuditStatus?: string;
    /**
     * 工商认证状态
     */
    bizCertStatus?: string;
    /**
     * 工商认证状态
     */
    bizCretStatus?: string;
    /**
     * 注册时间
     */
    bizRegisteyTime?: Date;
    /**
     * 注册类型
     */
    bizRegisteyType?: string;
    /**
     * 工商审核状态
     */
    bizReviewStatus?: string;
    /**
     * 联系人
     */
    contacter?: string;
    /**
     * 记录创建时间
     */
    createdAt?: Date;
    /**
     * 创建部门
     */
    createDept?: string;
    /**
     * 创建时间
     */
    createTime?: Date;
    /**
     * 统一社会信用代码
     */
    creditCode?: string;
    /**
     * 域名
     */
    domain?: string;
    /**
     * 瞪羚企业审核状态
     */
    gazelleAuditStatus?: string;
    /**
     * 瞪羚企业认证状态
     */
    gazelleCertStatus?: string;
    /**
     * 高新技术人力资源认证状态
     */
    hthrCertStatus?: string;
    /**
     * 高新技术企业认证状态
     */
    htsmeCertStatus?: string;
    /**
     * id
     */
    id?: number;
    /**
     * 行业代码
     */
    industry?: string;
    /**
     * 是否上市：0-否，1-是
     */
    ipo?: number;
    /**
     * 上市代码
     */
    ipoCode?: string;
    /**
     * 快递单号
     */
    kdBillno?: string;
    /**
     * 快递ID
     */
    kdId?: string;
    /**
     * 法定代表人
     */
    legalPerson?: string;
    /**
     * 法定代表人手机号
     */
    legalPersonmobile?: string;
    /**
     * 法定代表人姓名
     */
    legalPersonname?: string;
    /**
     * 企业名称
     */
    name?: string;
    /**
     * 组织机构代码
     */
    orgCode?: string;
    /**
     * 邮政编码
     */
    postCode?: string;
    /**
     * 地区代码
     */
    region?: string;
    /**
     * 注册资本
     */
    registeyAmount?: number;
    /**
     * 统计类型
     */
    statsType?: string;
    /**
     * 状态：0-无效，1-有效
     */
    status?: number;
    /**
     * 税务机关
     */
    taxAuthority?: string;
    /**
     * 技术属性
     */
    techAttr?: string;
    /**
     * 记录更新时间
     */
    updatedAt?: Date;
    /**
     * 更新时间
     */
    updateTime?: Date;
    /**
     * 是否风险投资：0-否，1-是
     */
    vc?: number;
    /**
     * 风险投资金额
     */
    vcAmount?: number;
    [property: string]: any;
  }

  export interface ProjectResPage extends ReqPage {
    createTime: number;
    updateTime: number;
    creator: string;
    updater: string;
    deleted: boolean;
    id: string;
    enterpriseId: string;
    enterpriseName: string;
    tenantId: number;
    code: string;
    name: string;
    source: string;
    type: string;
    domain: null;
    budgetAmount: number;
    govAmount: number;
    leader: null;
    target: string;
    devForm: null;
    content: null;
    expectedTarget: null;
    emergingIndustry: null;
    techTransform: number;
    industryDomain: null;
    applicant: null;
    fillDate: null;
    proposal: null;
    resolution: null;
    startTime: number;
    endTime: number;
    budgetLabor: null;
    budgetDirectIn: null;
    budgetDepreciation: null;
    budgetAmortize: null;
    budgetDesign: null;
    budgetEntrustDev: null;
    budgetOther: null;
    personnelQty: number;
    yearStages: YearStage[];
  }

  export interface YearStage {
    year?: number;
    stage?: null | string;
    achievementModality?: null | string;
    status?: string | null;
  }

  export interface YearReport {
    id: string;
    year: string;
    quarter: string;
    revenue: number;
    mainRevenue: number;
    profit: number;
    employee: number;
    developer: number;
    expenditure: number;
    techTransAmount: null;
    preparer: string;
    preparerPhone: string;
    projectNum: number;
    updateTime: number;
    dataSourceMethod: null;
  }

  export interface Projects {
    createTime: number;
    updateTime: number;
    creator: string;
    updater: string;
    deleted: boolean;
    id: number;
    year: string;
    quarter: string;
    projectId: string;
    projectCode: string;
    projectName: string;
    selfAmount: number;
    govAmount: number;
    externalAmount: number;
    otherAmount: number;
    expenditure: number;
    tenantId: number;
    enterpriseName: null;
    journalSummary: null;
  }

  /**
   * CompanyInfoVO对象，企业基本信息表
   */
  export interface CompanyInfoVO {
    /**
     * 规模以上企业认证状态
     */
    aboveScaleCertStatus?: string;
    /**
     * 地址
     */
    address?: string;
    /**
     * 行业大类
     */
    bindustry?: string;
    /**
     * 工商审核状态
     */
    bizAuditStatus?: string;
    /**
     * 工商认证状态
     */
    bizCertStatus?: string;
    /**
     * 工商认证状态
     */
    bizCretStatus?: string;
    /**
     * 注册时间
     */
    bizRegisteyTime?: Date;
    /**
     * 注册类型
     */
    bizRegisteyType?: string;
    /**
     * 工商审核状态
     */
    bizReviewStatus?: string;
    /**
     * 联系人
     */
    contacter?: string;
    /**
     * 记录创建时间
     */
    createdAt?: Date;
    /**
     * 创建部门
     */
    createDept?: string;
    /**
     * 创建时间
     */
    createTime?: Date;
    /**
     * 统一社会信用代码
     */
    creditCode?: string;
    /**
     * 域名
     */
    domain?: string;
    /**
     * 瞪羚企业审核状态
     */
    gazelleAuditStatus?: string;
    /**
     * 瞪羚企业认证状态
     */
    gazelleCertStatus?: string;
    /**
     * 高新技术人力资源认证状态
     */
    hthrCertStatus?: string;
    /**
     * 高新技术企业认证状态
     */
    htsmeCertStatus?: string;
    /**
     * id
     */
    id?: number;
    /**
     * 行业代码
     */
    industry?: string;
    /**
     * 是否上市：0-否，1-是
     */
    ipo?: number;
    /**
     * 上市代码
     */
    ipoCode?: string;
    /**
     * 快递单号
     */
    kdBillno?: string;
    /**
     * 快递ID
     */
    kdId?: string;
    /**
     * 法定代表人
     */
    legalPerson?: string;
    /**
     * 法定代表人手机号
     */
    legalPersonmobile?: string;
    /**
     * 法定代表人姓名
     */
    legalPersonname?: string;
    /**
     * 企业名称
     */
    name?: string;
    /**
     * 组织机构代码
     */
    orgCode?: string;
    /**
     * 邮政编码
     */
    postCode?: string;
    /**
     * 地区代码
     */
    region?: string;
    /**
     * 注册资本
     */
    registeyAmount?: number;
    /**
     * 统计类型
     */
    statsType?: string;
    /**
     * 状态：0-无效，1-有效
     */
    status?: number;
    /**
     * 税务机关
     */
    taxAuthority?: string;
    /**
     * 技术属性
     */
    techAttr?: string;
    /**
     * 记录更新时间
     */
    updatedAt?: Date;
    /**
     * 更新时间
     */
    updateTime?: Date;
    /**
     * 是否风险投资：0-否，1-是
     */
    vc?: number;
    /**
     * 风险投资金额
     */
    vcAmount?: number;
  }
}

export namespace Project {
  /**
   * ProjectsDTO对象，项目信息表
   */
  export interface ProjectsDTO {
    /**
     * 预算总金额 - 【可新增：非必填】【可编辑：非必填】
     */
    budgetAmount?: number;
    /**
     * 项目编号 - 【可新增：非必填】【可编辑：非必填】
     */
    code?: string;
    /**
     * 研究内容 - 【可新增：非必填】【可编辑：非必填】
     */
    content?: string;
    /**
     * 结束时间（毫秒时间戳） - 【可新增：非必填】【可编辑：非必填】
     */
    endTime?: number;
    /**
     * 政府金额 - 【可新增：非必填】【可编辑：非必填】
     */
    govAmount?: number;
    /**
     * id
     */
    id?: number;
    /**
     * 项目负责人 - 【可新增：非必填】【可编辑：非必填】
     */
    leader?: string;
    /**
     * 项目名称 - 【可新增：非必填】【可编辑：非必填】
     */
    name?: string;
    /**
     * 人员数量 - 【可新增：非必填】【可编辑：非必填】
     */
    personnelQty?: number;
    /**
     * 附件数据 - 【可新增：非必填】【可编辑：非必填】
     */
    projectAttachmentData?: string;
    /**
     * 附件
     */
    projectAttachments?: ProjectAttachmentDto[];
    /**
     * 项目来源 - 【可新增：非必填】【可编辑：非必填】
     */
    source?: string;
    /**
     * 开始时间（毫秒时间戳） - 【可新增：非必填】【可编辑：非必填】
     */
    startTime?: number;
    /**
     * 项目技术经济目标 - 【可新增：非必填】【可编辑：非必填】
     */
    target?: string;
    /**
     * 是否技改项目：0-否，1-是 - 【可新增：非必填】【可编辑：非必填】
     */
    techTransform?: number;
    /**
     * 租户ID - 【可新增：非必填】【可编辑：非必填】
     */
    tenantId?: number;
    /**
     * 项目开展形式 - 【可新增：非必填】【可编辑：非必填】
     */
    type?: string;
    /**
     * 年份进度
     */
    yearStages?: YearStageDto[];
    /**
     * 年份进度数据 - 【可新增：非必填】【可编辑：非必填】
     */
    yearStagesData?: string;
    [property: string]: any;
  }

  /**
   * projectAttachmentDto
   */
  export interface ProjectAttachmentDto {
    /**
     * 文件编号
     */
    code?: string;
    /**
     * 文件ids
     */
    fileIds?: number[];
    /**
     * 文件
     */
    files?: FileVo[];
    /**
     * 文件名称
     */
    name?: string;
    [property: string]: any;
  }

  /**
   * FileVo
   */
  export interface FileVo {
    /**
     * 文件id
     */
    id?: number;
    /**
     * MIME类型
     */
    mimeType?: string;
    /**
     * 文件名
     */
    name?: string;
    /**
     * 文件地址
     */
    url?: string;
    [property: string]: any;
  }

  /**
   * YearStageDto
   */
  export interface YearStageDto {
    /**
     * 成果形式
     */
    achievementModality?: string;
    /**
     * 阶段
     */
    stage?: string;
    /**
     * 状态
     */
    status?: string;
    /**
     * 项目技术经济目标
     */
    year?: number;
    [property: string]: any;
  }
  /**
   * ProjectsVO对象，项目信息表
   */
  export interface ProjectsVO {
    /**
     * 预算总金额
     */
    budgetAmount?: number;
    /**
     * 项目编号
     */
    code?: string;
    /**
     * 研究内容
     */
    content?: string;
    /**
     * 创建时间
     */
    createTime?: Date;
    /**
     * 结束时间（毫秒时间戳）
     */
    endTime?: number;
    /**
     * 政府金额
     */
    govAmount?: number;
    /**
     * id
     */
    id?: number;
    /**
     * 项目负责人
     */
    leader?: string;
    /**
     * 项目名称
     */
    name?: string;
    /**
     * 人员数量
     */
    personnelQty?: number;
    /**
     * 附件
     */
    projectAttachments?: ProjectAttachmentVo[];
    /**
     * 项目来源
     */
    source?: string;
    /**
     * 开始时间（毫秒时间戳）
     */
    startTime?: number;
    /**
     * 项目技术经济目标
     */
    target?: string;
    /**
     * 是否技改项目：0-否，1-是
     */
    techTransform?: number;
    /**
     * 租户ID
     */
    tenantId?: number;
    /**
     * 项目开展形式
     */
    type?: string;
    /**
     * 更新时间
     */
    updateTime?: Date;
    /**
     * 年份进度
     */
    yearStages?: YearStageVo[];
    [property: string]: any;
  }
  /**
   * projectAttachmentVo
   */
  export interface ProjectAttachmentVo {
    /**
     * 文件编号
     */
    code?: string;
    /**
     * 文件ids
     */
    fileIds?: number[];
    /**
     * 文件
     */
    files?: FileVo[];
    /**
     * 文件名称
     */
    name?: string;
    [property: string]: any;
  }

  /**
   * YearStageVo
   */
  export interface YearStageVo {
    /**
     * 联系方式
     */
    achievementModality?: string;
    /**
     * 阶段
     */
    stage?: string;
    /**
     * 状态
     */
    status?: string;
    /**
     * 项目技术经济目标
     */
    year?: number;
    [property: string]: any;
  }
  /**
   * CompanyScientificResearchInvestmentDTO对象，企业科研投入表
   */
  export interface CompanyScientificResearchInvestmentDTO {
    /**
     * 企业id - 【可新增：非必填】【可编辑：非必填】
     */
    companyId?: number;
    /**
     * 数据来源方法 - 【可新增：非必填】【可编辑：非必填】
     */
    dataSourceMethod?: string;
    /**
     * 研发人员数 - 【可新增：非必填】【可编辑：非必填】
     */
    developer?: number;
    /**
     * 员工总数 - 【可新增：非必填】【可编辑：非必填】
     */
    employee?: number;
    /**
     * 支出 - 【可新增：非必填】【可编辑：非必填】
     */
    expenditure?: number;
    /**
     * id
     */
    id?: number;
    /**
     * 主营业务收入 - 【可新增：非必填】【可编辑：非必填】
     */
    mainRevenue?: number;
    /**
     * 填报人 - 【可新增：非必填】【可编辑：非必填】
     */
    preparer?: string;
    /**
     * 填报人电话 - 【可新增：非必填】【可编辑：非必填】
     */
    preparerPhone?: string;
    /**
     * 利润 - 【可新增：非必填】【可编辑：非必填】
     */
    profit?: number;
    /**
     * 项目数量 - 【可新增：非必填】【可编辑：非必填】
     */
    projectNum?: number;
    /**
     * 季度 - 【可新增：非必填】【可编辑：非必填】
     */
    quarter?: number;
    /**
     * 总收入 - 【可新增：非必填】【可编辑：非必填】
     */
    revenue?: number;
    /**
     * 技术转让金额 - 【可新增：非必填】【可编辑：非必填】
     */
    techTransAmount?: number;
    /**
     * 年份 - 【可新增：非必填】【可编辑：非必填】
     */
    year?: number;
    [property: string]: any;
  }

  /**
   * CompanyScientificResearchInvestmentVO对象，企业科研投入表
   */
  export interface CompanyScientificResearchInvestmentVO {
    /**
     * 企业id
     */
    companyId?: number;
    /**
     * 创建时间
     */
    createTime?: Date;
    /**
     * 数据来源方法
     */
    dataSourceMethod?: string;
    /**
     * 开发人员数
     */
    developer?: number;
    /**
     * 员工总数
     */
    employee?: number;
    /**
     * 支出
     */
    expenditure?: number;
    /**
     * id
     */
    id?: number;
    /**
     * 主营业务收入
     */
    mainRevenue?: number;
    /**
     * 填报人
     */
    preparer?: string;
    /**
     * 填报人电话
     */
    preparerPhone?: string;
    /**
     * 利润
     */
    profit?: number;
    /**
     * 项目数量
     */
    projectNum?: number;
    /**
     * 季度
     */
    quarter?: number;
    /**
     * 总收入
     */
    revenue?: number;
    /**
     * 技术转让金额
     */
    techTransAmount?: number;
    /**
     * 更新时间
     */
    updateTime?: Date;
    /**
     * 年份
     */
    year?: number;
    [property: string]: any;
  }
}

export namespace FileBusinessType {
  /**
   * ProjectsDTO对象，项目信息表
   */
  export interface FileBusinessTypeVO {
    /**
     * 子行业
     */
    children?: FileBusinessTypeVO[];
    /**
     * 编号
     */
    code?: string;
    /**
     * 创建时间
     */
    createTime?: Date;
    /**
     * id
     */
    id?: number;
    /**
     * 名称
     */
    name?: string;
    /**
     * 体现父子关系
     */
    parentId?: number;
    /**
     * 排序，数字越大越靠前，默认0
     */
    sort?: number;
    /**
     * 更新时间
     */
    updateTime?: Date;
    [property: string]: any;
  }

  export interface FindPreviousPeriodDTO {
    /**
     * projectId
     */
    projectId?: number;
    /**
     * quarter
     */
    quarter?: number;
    /**
     * year
     */
    year?: number;
    [property: string]: any;
  }

  export interface FindCompanyPreviousPeriodDTO {
    /**
     * companyId
     */
    companyId?: number;
    /**
     * quarter
     */
    quarter?: number;
    /**
     * year
     */
    year?: number;
    [property: string]: any;
  }
}

// 菜单新增或编辑参数
export namespace Menu {
  export interface ReqMenuParams {
    component?: string;
    enabled?: boolean;
    hasChildren?: boolean;
    icon?: string;
    id?: number;
    inFrame?: boolean;
    isHide?: boolean;
    isFull?: boolean;
    isAffix?: boolean;
    keepAlive?: boolean;
    menuType: number | string;
    name: string;
    parentId?: number | string;
    parentName?: string;
    path?: string;
    permission?: string;
    routeName?: string;
    sort?: number;
    [property: string]: any;
  }
  export interface ResMenuTreeVO {
    children?: ResMenuTreeVO[];
    component?: string;
    enabled?: boolean;
    icon?: string;
    id?: number;
    inFrame?: boolean;
    isUrl?: boolean;
    keepAlive?: boolean;
    menuType?: number;
    name?: string;
    parentId?: number;
    parentName?: string;
    path?: string;
    permission?: string;
    routeName?: string;
    sort?: number;
    updateTime?: Date;
    [property: string]: any;
  }
  export interface ResMenuDetailVO {
    component?: string;
    createTime?: Date;
    enabled?: boolean;
    hasChildren?: boolean;
    icon?: string;
    id?: number;
    inFrame?: boolean;
    isUrl?: boolean;
    isHide?: boolean;
    isFull?: boolean;
    isAffix?: boolean;
    keepAlive?: boolean;
    menuType: number;
    name: string;
    parentId?: number;
    parentName?: string;
    path?: string;
    permission?: string;
    routeName?: string;
    sort?: number;
    updateTime?: Date;
    [property: string]: any;
  }
}

/**
 * 角色相关数据类型
 */
export namespace Role {
  export interface ReqRoleParams {
    code?: string;
    description?: string;
    enabled?: boolean;
    id?: number;
    menuIds?: number[];
    name?: string;
    [property: string]: any;
  }
  export interface ResRoleListVO {
    code?: string;
    createTime?: Date;
    description?: string;
    enabled?: boolean;
    id?: number;
    menuIds?: number[];
    name?: string;
    updateTime?: Date;
    [property: string]: any;
  }
  export interface ResRoleDetailVO {
    code?: string;
    createTime?: Date;
    description?: string;
    enabled?: boolean;
    id?: number;
    menuIds?: number[];
    name?: string;
    updateTime?: Date;
    [property: string]: any;
  }
}

/**
 * 字典相关数据类型
 */
export namespace Dict {
  export interface ReqDictParams {
    dictCode: string;
    dictName: string;
    dictType: number;
    id?: number;
    remark?: string;
    sort?: number;
  }
  export interface ResDictListVO {
    createTime?: Date;
    dictCode: string;
    dictName: string;
    dictType: number;
    id?: number;
    remark?: string;
    sort?: number;
    updateTime?: Date;
  }
  export interface ResDictDetailVO {
    createTime?: Date;
    dictCode: string;
    dictName: string;
    dictType: number;
    id?: number;
    remark?: string;
    sort?: number;
    updateTime?: Date;
  }
  export interface ReqDictDataParams {
    cssClass?: string;
    dictId: number;
    dictLabel?: string;
    dictValue?: string;
    id?: number;
    parentId?: number;
    remark?: string;
    sort?: number;
  }
  export interface ResDictDataDetail {
    createBy?: string;
    createTime?: string;
    cssClass?: string;
    dictId?: string | number;
    dictLabel?: string;
    dictValue?: string;
    id?: string;
    parentId?: string;
    remark?: string;
    sort?: number;
    updateBy?: string;
    updateTime?: string;
  }
}

/**
 * 字典类型相关数据类型（迁移自 party-dues-pc）
 */
export namespace SysDictType {
  export interface Req {
    id?: number;
    name: string;
    type: string;
    /** 状态：0 开启、1 关闭 */
    status: number;
    remark?: string;
  }
  export interface Resp extends Req {
    id: number;
    createTime?: number;
  }
  export interface SimpleResp {
    id: number;
    name: string;
    type: string;
  }
}

/**
 * 字典数据相关数据类型（迁移自 party-dues-pc）
 */
export namespace SysDictData {
  export interface Req {
    id?: number;
    sort: number;
    label: string;
    value: string;
    dictType: string;
    /** 状态：0 开启、1 关闭 */
    status: number;
    colorType?: string;
    cssClass?: string;
    remark?: string;
  }
  export interface Resp extends Req {
    id: number;
    createTime?: number;
  }
  export interface SimpleResp {
    dictType: string;
    value: string;
    label: string;
    colorType?: string;
    cssClass?: string;
    remark?: string;
  }
}

/**
 * 字典数据相关数据类型（迁移自 party-dues-h5）
 */
export namespace DictData {
  // 服务端返回的原始字典项结构，兼容 dictValue/dictLabel 和 value/label 两种字段命名
  export interface RawDictItem {
    dictValue?: string | number | boolean;
    dictLabel?: string;
    label?: string;
    remark?: string;
    dictRemark?: string;
    description?: string;
    desc?: string;
    range?: string;
    value?: string | number | boolean;
    [key: string]: unknown;
  }
  // 字典列表/树查询参数
  export interface DictListParams {
    dictCode: string;
    dictValues?: string | number | boolean | Array<string | number | boolean>;
    [key: string]: unknown;
  }
  // 新增字典数据请求参数
  export interface AddDictDataPayload {
    sort: number;
    label: string;
    value: string | number | boolean;
    dictType: string;
    status: number;
    colorType: string;
    cssClass: string;
    remark: string;
    [key: string]: unknown;
  }
}

/**
 * 账号相关数据类型
 */
export namespace Account {

  interface IdNameVo {
    id?: number;
    name?: string;
  }
  export interface ReqRestPassword {
    id: number;
    password: string;
    confirmPassword: string;
  }
  export interface ReqParams {
    deptIdList?: number[];
    deptList?: IdNameVo[];
    enabled?: boolean;
    id?: number;
    lastLoginTime?: Date;
    nickname?: string;
    password?: string;
    phone?: string;
    roleIdList?: number[];
    roleList?: IdNameVo[];
    sort?: number;
  }
  export interface ResListVO {
    createTime?: Date;
    deptIdList?: number[];
    deptList?: IdNameVo[];
    enabled?: boolean;
    id?: number;
    lastLoginTime?: Date;
    nickname?: string;
    password?: string;
    phone?: string;
    roleIdList?: number[];
    roleList?: IdNameVo[];
    sort?: number;
    updateTime?: Date;
  }
}

/**
 * 部门相关数据类型
 */
export namespace Department {
  export interface ReqParams {
    enabled?: boolean;
    hasChildren?: boolean;
    id?: number;
    name?: string;
    parentId?: number;
    parentName?: string;
    sort?: number;
    updateTime?: Date;
  }
  export interface ResListVO {
    children?: ResListVO[];
    createTime?: Date;
    enabled?: boolean;
    hasChildren?: boolean;
    id?: number;
    name?: string;
    parentId?: number;
    parentName?: string;
    sort?: number;
    updateTime?: Date;
  }
}