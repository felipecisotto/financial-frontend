import {BudgetUtilizationSection} from "./budget-utilization-section";
import {MonthSummarySection} from "./month-summary-section";
import {SectionCards} from "./section-cards";

export default function Dashboard() {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards/>
                    <BudgetUtilizationSection/>
                    <MonthSummarySection/>
                </div>
            </div>
        </div>
    )
}
