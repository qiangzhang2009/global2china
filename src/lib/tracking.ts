/**
 * 网站行为追踪工具
 * 用于采集用户访问和行为数据
 */

// 追踪事件类型
export type TrackEventType = 
  | 'page_view'        // 页面浏览
  | 'click'            // 点击事件
  | 'form_start'       // 表单开始填写
  | 'form_submit'      // 表单提交
  | 'ai_start'         // AI分析开始
  | 'ai_complete'      // AI分析完成
  | 'ai_abandon'       // AI分析放弃
  | 'scroll_depth'     // 滚动深度
  | 'stay_time'        // 停留时间
  | 'section_view';    // 区块浏览

// 追踪参数接口
export interface TrackEventParams {
  // 事件类型
  event_type: TrackEventType;
  
  // 页面信息
  page_url?: string;
  page_title?: string;
  referrer?: string;
  
  // 用户信息
  user_id?: string;
  session_id?: string;
  
  // 事件详情
  event_category?: string;    // 事件分类
  event_action?: string;      // 事件动作
  event_label?: string;       // 事件标签
  value?: number;             // 事件值
  
  // AI分析相关
  analysis_mode?: string;
  product_type?: string;
  product_name?: string;
  category_level1?: string;
  category_level2?: string;
  target_region?: string;
  selected_market?: string;
  user_role?: string;
  business_stage?: string;
  pain_points?: string[];
  result_summary?: string;
  ai_result_content?: string;
  ai_result_length?: number;
  
  // 工具相关
  tool_name?: string;
  tool_category?: string;
  
  // 表单相关
  form_name?: string;
  form_id?: string;
  form_field?: string;
  
  // 滚动/停留
  scroll_percent?: number;
  stay_duration?: number;
  section_id?: string;
  
  // 其他
  [key: string]: any;
}

// 等待追踪脚本加载
function waitForTracker(retries: number = 10): Promise<any> {
  return new Promise((resolve) => {
    const check = (attempt: number) => {
      if ((window as any).zxqTrack) {
        resolve((window as any).zxqTrack);
      } else if (attempt < retries) {
        setTimeout(() => check(attempt + 1), 100);
      } else {
        resolve(null);
      }
    };
    check(0);
  });
}

// 核心追踪函数
export async function track(
  eventType: TrackEventType,
  params: TrackEventParams
): Promise<void> {
  const tracker = await waitForTracker();
  
  if (!tracker) {
    console.warn('[Tracking] zxqTrack not available');
    return;
  }
  
  try {
    // 使用 zxqTrack 的通用事件追踪
    tracker.track?.(eventType, {
      ...params,
      event_type: eventType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Tracking] Error:', error);
  }
}

// 页面浏览追踪
export async function trackPageView(
  pageTitle: string,
  additionalParams?: Partial<TrackEventParams>
): Promise<void> {
  await track('page_view', {
    event_type: 'page_view',
    page_title: pageTitle,
    page_url: window.location.href,
    referrer: document.referrer,
    ...additionalParams,
  });
}

// 点击事件追踪
export async function trackClick(
  eventCategory: string,
  eventAction: string,
  eventLabel?: string,
  value?: number
): Promise<void> {
  await track('click', {
    event_category: eventCategory,
    event_action: eventAction,
    event_label: eventLabel,
    value,
  });
}

// 表单相关追踪
export async function trackFormStart(
  formName: string,
  formId?: string
): Promise<void> {
  await track('form_start', {
    form_name: formName,
    form_id: formId,
  });
}

export async function trackFormSubmit(
  formName: string,
  formId: string,
  formData: Record<string, any>
): Promise<void> {
  // 移除敏感数据
  const safeData = { ...formData };
  delete safeData.password;
  delete safeData.phone;
  delete safeData.email;
  
  await track('form_submit', {
    form_name: formName,
    form_id: formId,
    ...safeData,
  });
}

// AI 分析相关追踪
export async function trackAIStart(
  analysisMode: string,
  params: {
    productType?: string;
    productName?: string;
    categoryLevel1?: string;
    categoryLevel2?: string;
    targetRegion?: string;
    selectedMarket?: string;
    userRole?: string;
    businessStage?: string;
  }
): Promise<void> {
  await track('ai_start', {
    analysis_mode: analysisMode,
    product_type: params.productType,
    product_name: params.productName,
    category_level1: params.categoryLevel1,
    category_level2: params.categoryLevel2,
    target_region: params.targetRegion,
    selected_market: params.selectedMarket,
    user_role: params.userRole,
    business_stage: params.businessStage,
  });
}

export async function trackAIComplete(
  analysisMode: string,
  duration: number,
  params: {
    productType?: string;
    productName?: string;
    categoryLevel1?: string;
    categoryLevel2?: string;
    targetRegion?: string;
    selectedMarket?: string;
    userRole?: string;
    businessStage?: string;
    resultSummary?: string;
    aiResultContent?: string;
    aiResultLength?: number;
  }
): Promise<void> {
  await track('ai_complete', {
    analysis_mode: analysisMode,
    product_type: params.productType,
    product_name: params.productName,
    category_level1: params.categoryLevel1,
    category_level2: params.categoryLevel2,
    target_region: params.targetRegion,
    selected_market: params.selectedMarket,
    user_role: params.userRole,
    business_stage: params.businessStage,
    result_summary: params.resultSummary,
    ai_result_content: params.aiResultContent?.substring(0, 500),
    ai_result_length: params.aiResultLength,
    value: duration,
  });
}

export async function trackAIAbandon(
  analysisMode: string,
  progress: number = 0,
  reason?: string
): Promise<void> {
  await track('ai_abandon', {
    analysis_mode: analysisMode,
    event_label: reason,
    value: progress,
  });
}

// 滚动深度追踪
export async function trackScrollDepth(
  percent: number,
  sectionId?: string
): Promise<void> {
  await track('scroll_depth', {
    scroll_percent: percent,
    section_id: sectionId,
  });
}

// 停留时间追踪
export async function trackStayTime(
  duration: number,
  sectionId?: string
): Promise<void> {
  await track('stay_time', {
    stay_duration: Math.round(duration / 1000), // 转换为秒
    section_id: sectionId,
  });
}

// 区块浏览追踪
export async function trackSectionView(
  sectionId: string,
  sectionName: string
): Promise<void> {
  await track('section_view', {
    section_id: sectionId,
    section_name: sectionName,
  });
}

// 通用工具函数 - 可在组件中使用
export const useTracking = () => {
  return {
    track,
    trackPageView,
    trackClick,
    trackFormStart,
    trackFormSubmit,
    trackAIStart,
    trackAIComplete,
    trackAIAbandon,
    trackScrollDepth,
    trackStayTime,
    trackSectionView,
  };
};

export default {
  track,
  trackPageView,
  trackClick,
  trackFormStart,
  trackFormSubmit,
  trackAIStart,
  trackAIComplete,
  trackAIAbandon,
  trackScrollDepth,
  trackStayTime,
  trackSectionView,
  useTracking,
};
