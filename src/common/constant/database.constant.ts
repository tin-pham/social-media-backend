export const DATABASE_TABLE = {
  USERS: {
    NAME: 'users',
    SCHEMA: {
      ID: 'id',
      USERNAME: 'username',
      PASSWORD: 'password',
      DISPLAY_NAME: 'display_name',
      PHONE: 'phone',
      EMAIL: 'email',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  ROLE: {
    NAME: 'role',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
    },
  },
  USER_ROLE: {
    NAME: 'user_role',
    SCHEMA: {
      ID: 'id',
      USER_ID: 'user_id',
      ROLE_ID: 'role_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  STUDENT: {
    NAME: 'student',
    SCHEMA: {
      ID: 'id',
      USER_ID: 'user_id',
      PARENT_ID: 'parent_id',
    },
  },
  TEACHER: {
    NAME: 'teacher',
    SCHEMA: {
      ID: 'id',
      USER_ID: 'user_id',
    },
  },
  MENU: {
    NAME: 'menu',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      ROUTE: 'route',
      PARENT_ID: 'parent_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  ROLE_MENU: {
    NAME: 'role_menu',
    SCHEMA: {
      ID: 'id',
      ROLE_ID: 'role_id',
      MENU_ID: 'menu_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  COURSE: {
    NAME: 'course',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      DESCRIPTION: 'description',
      IMAGE_URL: 'image_url',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  SECTION: {
    NAME: 'section',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      COURSE_ID: 'course_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  DIFFICULTY: {
    NAME: 'difficulty',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  QUESTION: {
    NAME: 'question',
    SCHEMA: {
      ID: 'id',
      TEXT: 'text',
      IS_MULTIPLE_CHOICE: 'is_multiple_choice',
      DIFFICULTY_ID: 'difficulty_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  QUESTION_OPTION: {
    NAME: 'question_option',
    SCHEMA: {
      ID: 'id',
      TEXT: 'text',
      IS_CORRECT: 'is_correct',
      QUESTION_ID: 'question_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  EXERCISE: {
    NAME: 'exercise',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      DIFFICULTY_ID: 'difficulty_id',
      SECTION_ID: 'section_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  EXERCISE_QUESTION: {
    NAME: 'exercise_question',
    SCHEMA: {
      ID: 'id',
      EXERCISE_ID: 'exercise_id',
      QUESTION_ID: 'question_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  ATTACHMENT: {
    NAME: 'attachment',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      PATH: 'path',
      MIME_TYPE: 'mime_type',
      DIRECTORY_ID: 'directory_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  LESSON: {
    NAME: 'lesson',
    SCHEMA: {
      ID: 'id',
      TITLE: 'title',
      BODY: 'body',
      VIDEO_URL: 'video_url',
      SECTION_ID: 'section_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  LESSON_ATTACHMENT: {
    NAME: 'lesson_attachment',
    SCHEMA: {
      ID: 'id',
      URL: 'url',
      LESSON_ID: 'lesson_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  LESSON_COMMENT: {
    NAME: 'lesson_comment',
    SCHEMA: {
      ID: 'id',
      LESSON_ID: 'lesson_id',
      BODY: 'body',
      PARENT_ID: 'parent_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  COURSE_STUDENT: {
    NAME: 'course_student',
    SCHEMA: {
      ID: 'id',
      COURSE_ID: 'course_id',
      STUDENT_ID: 'student_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  ASSIGNMENT: {
    NAME: 'assignment',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      DESCRIPTION: 'description',
      DUE_DATE: 'due_date',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  COURSE_ASSIGNMENT: {
    NAME: 'course_assignment',
    SCHEMA: {
      ID: 'id',
      COURSE_ID: 'course_id',
      ASSIGNMENT_ID: 'assignment_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  ASSIGNMENT_ATTACHMENT: {
    NAME: 'assignment_attachment',
    SCHEMA: {
      ID: 'id',
      URL: 'url',
      ASSIGNMENT_ID: 'assignment_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  SECTION_EXERCISE: {
    NAME: 'section_exercise',
    SCHEMA: {
      ID: 'id',
      SECTION_ID: 'section_id',
      EXERCISE_ID: 'exercise_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  EXERCISE_SUBMIT: {
    NAME: 'exercise_submit',
    SCHEMA: {
      ID: 'id',
      EXERCISE_ID: 'exercise_id',
      STUDENT_ID: 'student_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  EXERCISE_SUBMIT_OPTION: {
    NAME: 'exercise_submit_option',
    SCHEMA: {
      ID: 'id',
      EXERCISE_SUBMIT_ID: 'exercise_submit_id',
      QUESTION_ID: 'question_id',
      QUESTION_OPTION_ID: 'question_option_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  EXERCISE_SUBMIT_MARK: {
    NAME: 'exercise_submit_mark',
    SCHEMA: {
      ID: 'id',
      EXERCISE_SUBMIT_ID: 'exercise_submit_id',
      POINT: 'point',
      CORRECT_COUNT: 'correct_count',
      TOTAL_COUNT: 'total_count',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
};
