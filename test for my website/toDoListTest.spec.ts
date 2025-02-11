import { expect, test } from "@playwright/test";
import { ToDoListMainPage } from "./toDoListMainPage.page";
import { todo } from "node:test";

test("Verify that error message is shown when task is not entered", async ({
  page,
}) => {
  const toDoListMainPage = new ToDoListMainPage(page);
  await toDoListMainPage.openPage();
  await toDoListMainPage.choosePriorityMedium();
  await toDoListMainPage.chooseStatusActive();
  await toDoListMainPage.chooseDate20240819();
  await toDoListMainPage.pressAddTaskButton();
  await toDoListMainPage.showErrorMessage();
});

test("Verify that error message is shown when date is not entered", async ({
  page,
}) => {
  const toDoListMainPage = new ToDoListMainPage(page);
  await toDoListMainPage.openPage();
  await toDoListMainPage.enterNewTaskGroceriesShopping();
  await toDoListMainPage.choosePriorityMedium();
  await toDoListMainPage.chooseStatusActive();
  await toDoListMainPage.pressAddTaskButton();
  await toDoListMainPage.showErrorMessage();
});

test("Verify that task is added when task field is filled and date is chosen", async ({
  page,
}) => {
  const toDoListMainPage = new ToDoListMainPage(page);
  await toDoListMainPage.openPage();
  await toDoListMainPage.enterNewTaskGroceriesShopping();
  await toDoListMainPage.chooseDate20240819();
  await toDoListMainPage.pressAddTaskButton();
  await toDoListMainPage.verifyThatTheTaskIsAdded();
});

test("Verify that date filter works", async ({ page }) => {
  const toDoListMainPage = new ToDoListMainPage(page);
  await toDoListMainPage.openPage();
  await toDoListMainPage.enterNewTaskGroceriesShopping();
  await toDoListMainPage.chooseDate20240819();
  await toDoListMainPage.pressAddTaskButton();
  await toDoListMainPage.enterNewTaskCarcleaning();
  await toDoListMainPage.chooseDate20240819();
  await toDoListMainPage.pressAddTaskButton();
  await toDoListMainPage.enterNewTaskLaundry();
  await toDoListMainPage.chooseDate20240921();
  await toDoListMainPage.pressAddTaskButton();
  await toDoListMainPage.chooseDateFilterToday();
});

test.only("Verify that PREVIOUS and NEXT page buttons work", async ({
  page,
}) => {
  const toDoListMainPage = new ToDoListMainPage(page);
  await toDoListMainPage.openPage();
  const tasksToAdd = [
    "Task 1",
    "Task 2",
    "Task 3",
    "Task 4",
    "Task 5",
    "Task 6",
  ];
  await toDoListMainPage.addNewTasksForCurrentDate(tasksToAdd);
  await page.pause();
  const tasksToAddForFuture = ["Task 7", "Task 8", "Task 9"];

  await toDoListMainPage.addNewTasksForNextMonth(tasksToAddForFuture);
  await page.pause();
  await toDoListMainPage.clickNextButton();
  await toDoListMainPage.clickPreviousButton();
  await page.pause();
});
