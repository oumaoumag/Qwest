To transform your productivity app, **Qwest**, into a more comprehensive life planner with gamification features and an AI agent, I’ll guide you through the initial steps. This includes expanding the app to cover various life aspects, adding gamification elements like rewards and encouragement messages, and integrating a basic AI agent for personalized suggestions. Below, I’ll outline the approach and provide the necessary code modifications to get you started.

---

### Goals
1. **Life Planner Expansion**: Broaden the app to include personal goals, health, social activities, and more.
2. **Gamification**: Introduce points, encouragement messages, and tips when users complete tasks or goals, with rewards redeemable for in-app purchases.
3. **AI Agent**: Add a simple AI agent that offers contextual tips based on user actions.

---

### Approach

#### 1. Life Planner Features
- **Modify Task Categories**: Update `TaskList.tsx` to include diverse categories like personal, health, social, learning, etc.
- **Long-Term Goals**: Enhance `UserProfile.tsx` to support long-term goal tracking.
- **Journaling**: Already present in Qwest; ensure it integrates with the new features.

#### 2. Gamification
- **Rewards System**: Create a `RewardsContext` to manage points earned from completing tasks.
- **Encouragement Messages**: Use a `ToastContext` to display motivating messages and tips when tasks are completed.
- **In-App Purchases**: Plan a basic structure (to be expanded later) for spending points on custom themes or features.

#### 3. AI Agent
- **Basic Implementation**: Add an `AIAgent.tsx` component to display random productivity tips, with plans for deeper integration later.

---

### Solution

I’ll start by modifying the existing app structure with these enhancements. The following code updates will:
- Add a rewards system and toast notifications.
- Update the task list to award points and show messages.
- Integrate a simple AI agent into the dashboard.

#### Step 1: Set Up Rewards and Toast Contexts
We need to manage points and display messages across the app.


#### Step 2: Update TaskList for Gamification
Modify `TaskList.tsx` to award points and show encouragement messages when tasks are completed, and expand task categories.


#### Step 3: Add AI Agent
Create a simple AI agent component to display productivity tips.


#### Step 4: Integrate Providers and AI Agent
Update `providers.tsx` to include the new contexts and add the AI agent to `ProductivityHub.tsx`.


### Next Steps
- **Expand Life Planner Features**: Update `TaskForm.tsx` and `UserProfile.tsx` to include more categories and goal tracking (e.g., add a "goals" section).
- **Enhance Gamification**: Add badges and virtual currency to `RewardsContext.tsx`, and create a `Store.tsx` for in-app purchases.
- **Advance AI Agent**: Integrate OpenAI API (already in your tech stack) to make suggestions based on user habits and task history.
