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
  PARENT: {
    NAME: 'parent',
    SCHEMA: {
      ID: 'id',
      USER_ID: 'user_id',
    },
  },
  STUDENT_PARENT: {
    NAME: 'student_parent',
    SCHEMA: {
      ID: 'id',
      STUDENT_ID: 'student_id',
      PARENT_ID: 'parent_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  SUBJECT: {
    NAME: 'subject',
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
  GROUP: {
    NAME: 'group',
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
  SUBJECT_GROUP: {
    NAME: 'subject_group',
    SCHEMA: {
      ID: 'id',
      SUBJECT_ID: 'subject_id',
      GROUP_ID: 'group_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  GRADE: {
    NAME: 'grade',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      GRADE_ID: 'grade_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  CLASSROOM: {
    NAME: 'classroom',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      GRADE_ID: 'grade_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  SEMESTER: {
    NAME: 'semester',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      START_DATE: 'start_date',
      END_DATE: 'end_date',
      YEAR_ID: 'year_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  YEAR: {
    NAME: 'year',
    SCHEMA: {
      ID: 'id',
      NAME: 'name',
      START_DATE: 'start_date',
      END_DATE: 'end_date',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  CLASSROOM_YEAR: {
    NAME: 'classroom_year',
    SCHEMA: {
      ID: 'id',
      CLASSROOM_ID: 'classroom_id',
      YEAR_ID: 'year_id',
      FORM_TEACHER_ID: 'form_teacher_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  YEAR_GRADE: {
    NAME: 'year_grade',
    SCHEMA: {
      ID: 'id',
      YEAR_ID: 'year_id',
      GRADE_ID: 'grade_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  TEACHER_SUBJECT: {
    NAME: 'teacher_subject',
    SCHEMA: {
      ID: 'id',
      TEACHER_ID: 'teacher_id',
      SUBJECT_ID: 'subject_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  CLASSROOM_YEAR_STUDENT: {
    NAME: 'classroom_year_student',
    SCHEMA: {
      ID: 'id',
      CLASSROOM_YEAR_ID: 'classroom_year_id',
      STUDENT_ID: 'student_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
    },
  },
  CLASSROOM_YEAR_ASSIGNMENT: {
    NAME: 'classroom_year_assignment',
    SCHEMA: {
      ID: 'id',
      CLASSROOM_YEAR_ID: 'classroom_year_id',
      TEACHER_SUBJECT_ID: 'teacher_subject_id',
      CREATED_AT: 'created_at',
      CREATED_BY: 'created_by',
      UPDATED_AT: 'updated_at',
      UPDATED_BY: 'updated_by',
      DELETED_AT: 'deleted_at',
      DELETED_BY: 'deleted_by',
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
  FILE: {
    NAME: 'file',
    SCHEMA: {
      ID: 'id',
      URL: 'url',
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
};
