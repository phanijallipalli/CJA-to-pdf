const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const urls = [
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#releases",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/releases/latest",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/releases/2024",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/releases/2023",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/releases/2022",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/releases/2021",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/releases/2020",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/releases/releases",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/releases/doc-changes",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-getting-started",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/landing",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-faq",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/cja-vs-bi",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-overview/ai-assistant",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#compare-aa-cja",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#upgrade-to-cja",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-getstarted",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-path",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-send-to-platform",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-historical-data",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-aa-comparison",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/aa-data-in-cja",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/cja-aa",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/terminology",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/data-processing-comparisons",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/vrs-dataview-sandbox-adc",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/pr-vista-dataprep",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/cja-aa-comparison/aaid-ecid-adc",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/aa-to-cja",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/aa-to-cja-user",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-data-ingestion",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/data-ingestion",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#ingest-use-guides",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/analytics",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#edge-network",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/edge-network/aepwebsdk",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/edge-network/aepmobilesdk",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/edge-network/serverapi",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/batch",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/streaming",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-data-ingestion/ingest-use-guides/sources",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-connections",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/create-connection",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/manage-connections",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/combined-dataset",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/standard-lookups",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-connections/transform-datasets-b2b-lookups",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-dataviews",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/data-views",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/create-dataview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/session-settings",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#component-settings",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-settings/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-settings/attribution",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-settings/behavior",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-settings/format",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-settings/include-exclude-values",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-settings/metric-deduplication",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-settings/no-value-options",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-settings/persistence",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-settings/substring",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-settings/summary-data-group",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-settings/value-bucketing",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/component-reference",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/bi-extension",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/derived-fields",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/summary-data",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dataviews/data-governance",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#tools",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#asset-transfer",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/tools/asset-transfer/transfer-assets",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#product-usage",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/tools/product-usage/usage-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/tools/product-usage/data-settings",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/tools/product-usage/opt-out-settings",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-workspace",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/home",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/perform-basic-analysis",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/perform-adv-analysis",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#build-workspace-project",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/freeform-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/create-projects",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/open-projects",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/save-projects",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#workspace-folders",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/workspace-folders/about-folders",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/workspace-folders/create-folders",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/workspace-folders/manage-folders",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/workspace-folders/add-projects",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/fa-shortcut-keys",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/color-palettes",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/build-workspace-project/view-density",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#templates",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/templates/use-templates",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/templates/create-templates",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#visualizations",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/freeform-analysis-visualizations",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/t-sync-visualization",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/intelligent-captions",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#freeform-table",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/freeform-table/freeform-table",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/freeform-table/freeform-table-hyperlinks",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#column-row-settings",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/freeform-table/column-row-settings/column-settings",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/freeform-table/column-row-settings/table-settings",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/freeform-table/column-row-settings/manual-vs-dynamic-rows",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/freeform-table/filter-and-sort",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/freeform-table/workspace-totals",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cohort-table",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/cohort-table/cohort-analysis",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/cohort-table/t-cohort",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/cohort-table/cohort-use-cases",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#fallout",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/fallout/fallout-flow",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/fallout/configuring-fallout",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/fallout/configuring-interdimensional-fallout",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/fallout/compare-segments-fallout",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#flow",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/flow/flow",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/flow/create-flow",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/flow/multi-dimensional-flow",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#journey-canvas",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/journey-canvas/journey-canvas",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/journey-canvas/configure-journey-canvas",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/journey-canvas/journey-canvas-troubleshooting",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/area",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/bar",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/bullet-graph",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/combo-charts",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/donut",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/histogram",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/horizontal-bar",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/key-metric",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/line",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/scatterplot",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/section-header",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/summary-number-change",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/text",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/treemap",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/visualizations/venn",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#panels",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/panels/panels",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/panels/blank-panel",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/panels/attribution",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/panels/experimentation",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/panels/freeform-panel",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/panels/average-minute-audience-panel",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/panels/media-concurrent-viewers",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/panels/media-playback-time-spent",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/panels/next-previous",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/panels/quickinsight",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#curate-share",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/curate-share/send-schedule-files",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/curate-share/curate",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/curate-share/share-projects",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/curate-share/shareable-links",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/curate-share/view-only-projects",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#export",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/export/export-project-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/export/download-send",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/export/t-schedule-report",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/export/export-cloud",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#anomaly-detection",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/anomaly-detection/anomaly-detection",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/anomaly-detection/view-anomalies",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/anomaly-detection/statistics-anomaly-detection",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#forecasting",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/forecasting/forecasting",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/forecasting/view-forecasts",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/forecasting/statistics-forecasting",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/project-table-of-contents",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/user-preferences",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#workspace-faq",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/workspace-faq/faq",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/workspace-faq/error-messages",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/workspace-faq/aw-limitations",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/workspace-faq/frequently-asked-questions-analysis-workspace",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/workspace-faq/aw-accessibility",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-dashboards",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dashboards/home",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dashboards/curator",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dashboards/create-scorecard",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dashboards/manage-scorecard",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dashboards/set-up-execs",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-dashboards/executive",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#guided-analysis",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/active-growth",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/conversion-trends",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/engagement",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/first-use-impact",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/frequency",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/funnel",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/net-growth",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/release-impact",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/retention",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/timeline",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/trends",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/industry-use-cases",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/guided-analysis/faq",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-components",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/use-components-in-workspace",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/add-component-descriptions",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#annotations",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/annotations/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/annotations/create-annotations",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/annotations/manage-annotations",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/annotations/view-annotations",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/annotations/mobile-annotations",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/scheduled-projects-manager",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#audiences",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/audiences-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/publish",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/audiences/manage",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#dimensions",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/dimensions/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/dimensions/view-dimensions",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/dimensions/t-breakdown-fa",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/dimensions/time-parting-dimensions",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/dimensions/high-cardinality",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/apply-create-metrics",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-filters",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/filters-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/create-filters",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/filter-builder",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/quick-filters",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/seg-sequential-build",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/filters-share",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/filters-tag",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/filters-filter",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/filters-favorite",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/filters-approve",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/filters-copy",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/manage-filters",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-filters/operators",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-calcmetrics",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/calc-metr-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cm-workflow",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-workflow",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-build-metrics",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-finding",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/m-metric-type-alloc",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/participation-metric",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/metrics-with-segments",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-stack-seg",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-filter",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-favorite",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-copy",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-using-functions",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-tagging",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-approving",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-sharing",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-manager",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-workflow/cm-weighted-metric",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/default-calcmetrics",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-functions",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-calcmetrics/cm-adv-functions",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-date-ranges",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-date-ranges/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-date-ranges/create",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-date-ranges/manage",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-date-ranges/time-comparison",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/cja-date-ranges/custom-date-ranges",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#alerts",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/alerts/intelligent-alerts",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/alerts/alert-builder",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/alerts/alert-manager",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/alerts/alerts-feature-comparison",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/alerts/alerts-use-cases",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#exports",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/exports/cloud-export-accounts",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/exports/cloud-export-locations",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/exports/manage-export-locations",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/exports/manage-exports",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/exports/manage-export-logs",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/exports/troubleshoot-exports",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#data-dictionary",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/data-dictionary/data-dictionary-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/data-dictionary/view-data-dictionary",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/data-dictionary/edit-entries-data-dictionary",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-components/data-dictionary/monitor-data-dictionary-health",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-reportbuilder",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/report-buider-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/report-builder-setup",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/create-a-data-block",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/report-builder-hub",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/select-data-view",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/select-date-range",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/work-with-filters",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/filter-dimensions",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/manage-reportbuilder",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/schedule-reportbuilder",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/restricted-labels",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-reportbuilder/report-builder-settings",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#reporting-activity-manager",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/reporting-activity-manager/reporting-activity-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/reporting-activity-manager/reporting-activity",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/reporting-activity-manager/reporting-activity-cancel-requests",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#stitching",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/stitching/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/stitching/fbs",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/stitching/gbs",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/stitching/use-stitching",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/stitching/faq",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#integrations",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/aa",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/at",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/ajo",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/ajo-od",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/integrations/customer-ai",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-privacy",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-privacy/privacy-overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-privacy/audit-log",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-privacy/cmk",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cja-usecases",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/cja-usecases",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#ga",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/ga/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/ga/backfill",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/ga/streaming",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/ga/report",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#data-ingestion",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-ingestion/marketo",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-ingestion/ingest-aep-segments",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#data-views",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-views/data-views-usecases",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-views/binding-dimensions-metrics",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-views/summary-data",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-views/bi-extension-usecases",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#data-export",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-export/overview",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-export/bi-extension",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-export/export-datasets",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-export/export-full-table",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/data-export/queryservice-export-datasets",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#b2b",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/b2b/example",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#cross-channel",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/cross-channel/cross-channel",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/cross-channel/call-center",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#aa-data",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/aa-data/marketing-channels",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/aa-data/combine-report-suites",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#complex-data",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/complex-data/object-arrays",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#stitching",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/stitching/shared-devices",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#derived-fields",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-usecases/derived-fields/goals-using-derived-fields",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#labs",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/labs/labs",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#troubleshooting",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/troubleshooting/compare",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/troubleshooting/consistency-rcdp-cja",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/troubleshooting/lack-of-permissions",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing#technotes",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/technotes/access-control",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/technotes/data-centers",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/technotes/deletion",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/technotes/domains",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/technotes/glossary",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/technotes/guardrails",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/technotes/ip-addresses",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/technotes/optimizing-performance",
    "https://experienceleague.adobe.com/en/docs/analytics-platform/using/technotes/estimate-usage",
    "https://developer.adobe.com/cja-apis/docs/",
];

const tempPdfDir = 'temp_pdfs';
if (!fs.existsSync(tempPdfDir)) fs.mkdirSync(tempPdfDir);

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        let pdfFiles = [];
        let pdfTitles = [];
        let pageOffsets = [];

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            try {
                console.log(`📄 Processing: ${url}`);

                await page.goto(url, { waitUntil: 'networkidle2' });

                // Remove unwanted elements
                await page.evaluate(() => {
                    const selectors = [
                        'header',
                        'footer',
                        '.article-metadata-wrapper',
                        '.article-metadata.block',
                        '.article-metadata-topics-wrapper',
                        '.article-metadata-createdby-wrapper',
                        'section.doc-actions-container',
                        'section.mini-toc-container',
                        'section.rail.rail-right',
                        'section.toc-container',
                        'section.rail.rail-left',
                        '.rail-content',
                        '.breadcrumbs-wrapper'
                    ];
                    selectors.forEach(selector => {
                        document.querySelectorAll(selector).forEach(el => el.remove());
                    });
                });

                // Extract title from `.default-content-wrapper`
                let pageTitle = await page.evaluate(() => {
                    const titleEl = document.querySelector('.default-content-wrapper h1');
                    return titleEl ? titleEl.innerText.trim() : 'Untitled';
                });

                console.log(`🔹 Title Extracted: ${pageTitle}`);
                pdfTitles.push(pageTitle);

                // Convert page to PDF
                let pdfPath = `${tempPdfDir}/page_${i + 1}.pdf`;
                await page.pdf({
                    path: pdfPath,
                    format: 'A4',
                    printBackground: true
                });

                pdfFiles.push(pdfPath);
                console.log(`✅ Saved PDF: ${pdfPath}`);
            } catch (error) {
                console.error(`❌ Error processing ${url}:`, error);
            }
        }

        await browser.close();
        console.log("📄 Merging all PDFs with a TOC...");

        // Merge PDFs with Table of Contents (TOC)
        const mergedPdf = await PDFDocument.create();
        const font = await mergedPdf.embedFont(StandardFonts.HelveticaBold);
        const fontSize = 14;
        let pageIndex = 1; // Tracks total pages

        // Create TOC Page
        const tocPage = mergedPdf.addPage();
        const { width } = tocPage.getSize();
        let yOffset = 700;
        tocPage.drawText('Table of Contents', { x: 50, y: yOffset, size: 10, font, color: rgb(0, 0, 0) });

        // Track page offsets for TOC links
        for (let i = 0; i < pdfFiles.length; i++) {
            const existingPdf = await PDFDocument.load(fs.readFileSync(pdfFiles[i]));
            const copiedPages = await mergedPdf.copyPages(existingPdf, existingPdf.getPageIndices());
            pageOffsets.push(pageIndex);
            pageIndex += copiedPages.length;

            // Add TOC entry with link
            yOffset -= 30;
            tocPage.drawText(`${i + 1}. ${pdfTitles[i]} (Page ${pageOffsets[i]})`, {
                x: 50,
                y: yOffset,
                size: fontSize,
                font,
                color: rgb(0, 0, 1),
            });

            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const outputPdfPath = 'merged_document.pdf';
        fs.writeFileSync(outputPdfPath, mergedPdfBytes);

        console.log(`🎉 Merged PDF with TOC saved as: ${outputPdfPath}`);

        // Cleanup temporary files
        pdfFiles.forEach(file => fs.unlinkSync(file));
        fs.rmdirSync(tempPdfDir, { recursive: true });

    } catch (error) {
        console.error("❌ Critical error:", error);
    }
})();
