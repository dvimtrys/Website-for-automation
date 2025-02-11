import { expect, type Locator, type Page } from "@playwright/test";

export class ToDoListMainPage {
  readonly page: Page;
  readonly taskTextField: Locator;
  readonly priorityDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly dateBox: Locator;
  readonly addTaskButton: Locator;
  readonly filterPriorityDropdown: Locator;
  readonly filterStatusDropdown: Locator;
  readonly filterDateDropdown: Locator;
  readonly emailField: Locator;
  readonly subscribeCheckbox: Locator;
  readonly subscribeButton: Locator;
  readonly addedTask: Locator;
  readonly editTaskButton: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly page1of3Text: Locator;
  readonly page2of3Text: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskTextField = page.getByPlaceholder("Enter a new task...");
    this.priorityDropdown = page.locator("#priority-select");
    this.statusDropdown = page.locator("#status-select");
    this.dateBox = page.locator("#due-date");
    this.addTaskButton = page.getByRole("button", { name: "Add Task" });
    this.filterPriorityDropdown = page.getByLabel("Priority:");
    this.filterStatusDropdown = page.getByLabel("Status:");
    this.filterDateDropdown = page.getByLabel("Date:");
    this.emailField = page.getByPlaceholder("Enter your email");
    this.subscribeCheckbox = page.getByLabel("* Subscribe to newsletter");
    this.subscribeButton = page.getByRole("button", { name: "Subscribe" });
    this.addedTask = page.getByText(" Groceries shopping");
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.previousButton = page.getByRole("button", { name: "Previous" });
    this.page1of3Text = page.getByText("Page 1 of 3");
    this.page2of3Text = page.getByText("Page 2 of 3");
  }

  async openPage() {
    await this.page.goto(
      "http://127.0.0.1:5500/tests/Website%20for%20automation%20copy/index.html"
    );
    await expect(this.page).toHaveURL(
      "http://127.0.0.1:5500/tests/Website%20for%20automation%20copy/index.html"
    );
  }

  async leaveTaskFieldEmpty() {
    await this.taskTextField.fill("");
  }

  async enterNewTaskGroceriesShopping() {
    await this.taskTextField.fill("Groceries shopping");
  }

  async enterNewTaskCarcleaning() {
    await this.taskTextField.fill("Car cleaning");
  }

  async enterNewTaskLaundry() {
    await this.taskTextField.fill("Laundry");
  }

  async enterNewTaskPayTaxes() {
    await this.taskTextField.fill("Pay taxes");
  }

  async choosePriorityMedium() {
    await this.priorityDropdown.selectOption("Medium");
  }

  async chooseStatusActive() {
    await this.statusDropdown.selectOption("Active");
  }

  async chooseDate20240819() {
    await this.dateBox.fill("2024-08-19");
  }

  async chooseDate20240921() {
    await this.dateBox.fill("2024-09-21");
  }

  async pressAddTaskButton() {
    await this.addTaskButton.click();
  }

  async verifyThatTheTaskIsAdded() {
    await expect(this.addedTask).toBeVisible();
    await expect(this.addedTask).toHaveText("Groceries shopping");
  }

  async choosePriorityFilterMedium() {
    await this.filterPriorityDropdown.selectOption("Medium");
  }

  async chooseStatusFilterActive() {
    await this.filterStatusDropdown.selectOption("Active");
  }

  async chooseDateFilterThisWeek() {
    await this.filterStatusDropdown.selectOption("This week");
  }

  async chooseDateFilterToday() {
    await this.filterStatusDropdown.selectOption("Today");
  }

  async writeinValidEmail() {
    await this.emailField.fill("m@m.lt");
  }

  async writeinInvalidEmail() {
    await this.emailField.fill("mm.lt");
  }

  async checkSubscribeCheckbox() {
    await this.subscribeCheckbox.check();
  }

  async pressSubscribeButton() {
    await this.subscribeButton.click();
  }

  async showErrorMessage() {
    this.page.on("dialog", (dialog) => dialog.accept());
  }

  async clickNextButton() {
    await this.nextButton.isVisible();
    await this.nextButton.click();
    await this.page1of3Text.isVisible();
  }

  async clickPreviousButton() {
    await this.previousButton.isVisible();
    await this.previousButton.click();
    await this.page2of3Text.isVisible();
  }

  async addNewTasksForCurrentDate(tasks: string[]) {
    const currentDate = new Date().toISOString().split("T")[0];
    for (const task of tasks) {
      // Step 2: Enter the task name into the input field
      const taskInput = this.page.getByPlaceholder("Enter a new task..."); // Adjust the placeholder text as needed
      await taskInput.fill(task);
      await this.dateBox.fill(currentDate);

      // Step 3: Click the "Save" or "Submit" button to add the task
      await this.page.getByRole("button", { name: "Add task" }).click();

      // Optionally, you can add a small delay or wait for the task to be added before continuing
      await this.page.waitForTimeout(500); // Wait for 0.5 seconds (adjust if needed)
    }
  }

  async addNewTasksForNextMonth(tasks: string[]) {
    // Calculate the date one month from today
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);

    // Format the date as 'YYYY-MM-DD'
    const futureDate = currentDate.toISOString().split("T")[0];

    for (const task of tasks) {
      // Step 2: Enter the task name into the input field
      const taskInput = this.page.getByPlaceholder("Enter a new task..."); // Adjust the placeholder text as needed
      await taskInput.fill(task);

      // Fill the date box with the future date (one month from today)
      await this.dateBox.fill(futureDate);

      // Step 3: Click the "Save" or "Submit" button to add the task
      await this.page.getByRole("button", { name: "Add task" }).click();

      // Optionally, you can add a small delay or wait for the task to be added before continuing
      await this.page.waitForTimeout(500); // Wait for 0.5 seconds (adjust if needed)
    }
  }
}
