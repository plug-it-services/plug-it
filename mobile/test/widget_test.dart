// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/PlugApi.dart';

import 'package:mobile/main.dart';

void main() {
  group('Login Page Test', () {
    testWidgets('On Login Page at Start', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final usernameField = find.byKey(const ValueKey('loginEmailField'));
      final passwordField = find.byKey(const ValueKey('loginPasswordField'));

      // Verify that
      expect(usernameField, findsOneWidget);
      expect(passwordField, findsOneWidget);

      final firstnameField =
          find.byKey(const ValueKey("registerFirstnameField"));
      final lastnameField = find.byKey(const ValueKey("registerLastnameField"));

      expect(firstnameField, findsNothing);
      expect(lastnameField, findsNothing);
    });

    testWidgets('Google Auth Button Present', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));

      final googleButton = find.byKey(const ValueKey('loginGoogleButton'));

      expect(googleButton, findsOneWidget);
    });

    testWidgets('Go To Register Button Present', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButtonParent =
          find.byKey(const ValueKey('loginGoToRegisterButton'));
      final goToRegisterButton = find.descendant(
          of: goToRegisterButtonParent, matching: find.byType(GestureDetector));

      expect(goToRegisterButton, findsOneWidget);
    });

    testWidgets('Sign In Button Present', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final signButtonParent = find.byKey(const ValueKey('loginSignButton'));
      final signButton = find.descendant(
          of: signButtonParent, matching: find.byType(GestureDetector));

      expect(signButton, findsOneWidget);
    });

    testWidgets('Remember Me Checkbox Present', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));

      expect(find.text('Remember me:'), findsOneWidget);
    });

    testWidgets('Password Field Present', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final passwordField = find.byKey(const ValueKey('loginPasswordField'));

      expect(passwordField, findsOneWidget);
    });

    testWidgets('Username Field Present', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final usernameField = find.byKey(const ValueKey('loginEmailField'));

      expect(usernameField, findsOneWidget);
    });

    testWidgets('Password field modified', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final passwordField = find.byKey(const ValueKey('loginPasswordField'));

      await tester.enterText(passwordField, 'azerA@ty1234');
      await tester.pumpAndSettle();
      expect(find.text('azerA@ty1234'), findsOneWidget);
    });

    testWidgets('Email field modified', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final usernameField = find.byKey(const ValueKey('loginEmailField'));

      await tester.enterText(usernameField, 'titi@toto.com');
      await tester.pumpAndSettle();
      expect(find.text('titi@toto.com'), findsOneWidget);
    });

    testWidgets('Go to register', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp(isUnitTesting: true));

      final goToRegisterButtonParent =
          find.byKey(const ValueKey('loginGoToRegisterButton'));
      final goToRegisterButton = find.descendant(
          of: goToRegisterButtonParent, matching: find.byType(GestureDetector));

      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();
      expect(find.text("Sign Up"), findsOneWidget);
    });

    testWidgets('Invalid token null', (WidgetTester tester) async {
      // Build our app and trigger a frame
      PlugApi.init();
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final usernameField = find.byKey(const ValueKey('loginEmailField'));
      final passwordField = find.byKey(const ValueKey('loginPasswordField'));
      final signButtonParent = find.byKey(const ValueKey('loginSignButton'));
      final signButton = find.descendant(
          of: signButtonParent, matching: find.byType(GestureDetector));

      await tester.enterText(usernameField, 'titi@toto.com');
      await tester.enterText(passwordField, 'f@tfy1df234');
      await tester.tap(signButton);
      await tester.pumpAndSettle(const Duration(seconds: 3));
      expect(PlugApi.token, isNull);
    });

    testWidgets('Invalid stay on page', (WidgetTester tester) async {
      // Build our app and trigger a frame
      PlugApi.init();
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final usernameField = find.byKey(const ValueKey('loginEmailField'));
      final passwordField = find.byKey(const ValueKey('loginPasswordField'));
      final signButtonParent = find.byKey(const ValueKey('loginSignButton'));
      final signButton = find.descendant(
          of: signButtonParent, matching: find.byType(GestureDetector));

      await tester.enterText(usernameField, 'titi@toto.com');
      await tester.enterText(passwordField, 'azerfdsdfA@ty12sdf34');
      await tester.tap(signButton);
      await tester.pumpAndSettle(const Duration(seconds: 3));
      expect(find.byKey(const ValueKey("homeMainWidget")), findsNothing);
    });
  });

  group('Register Page Test', () {
    testWidgets('Not on Page at Start', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final usernameField = find.byKey(const ValueKey('loginEmailField'));
      final passwordField = find.byKey(const ValueKey('loginPasswordField'));

      // Verify that
      expect(usernameField, findsOneWidget);
      expect(passwordField, findsOneWidget);

      final firstnameField =
          find.byKey(const ValueKey("registerFirstnameField"));
      final lastnameField = find.byKey(const ValueKey("registerLastnameField"));

      expect(firstnameField, findsNothing);
      expect(lastnameField, findsNothing);
    });

    testWidgets('All Fields Present', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButton = find.descendant(
          of: find.byKey(const ValueKey('loginGoToRegisterButton')),
          matching: find.byType(GestureDetector));
      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();

      final lastnameField = find.byKey(const ValueKey("registerLastnameField"));

      expect(lastnameField, findsOneWidget);
    });

    testWidgets('Firstname Field Present', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButton = find.descendant(
          of: find.byKey(const ValueKey('loginGoToRegisterButton')),
          matching: find.byType(GestureDetector));
      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();

      final firstnameField =
          find.byKey(const ValueKey("registerFirstnameField"));

      expect(firstnameField, findsOneWidget);
    });

    testWidgets('Password Field Present', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButton = find.descendant(
          of: find.byKey(const ValueKey('loginGoToRegisterButton')),
          matching: find.byType(GestureDetector));
      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();

      final passwordField = find.byKey(const ValueKey("registerPasswordField"));

      // Verify that
      expect(passwordField, findsOneWidget);
    });

    testWidgets('Email Field Present', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButton = find.descendant(
          of: find.byKey(const ValueKey('loginGoToRegisterButton')),
          matching: find.byType(GestureDetector));
      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();

      final emailField = find.byKey(const ValueKey("registerEmailField"));

      // Verify that
      expect(emailField, findsOneWidget);
    });

    testWidgets('Go To Login Button Present', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButton = find.descendant(
          of: find.byKey(const ValueKey('loginGoToRegisterButton')),
          matching: find.byType(GestureDetector));
      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();

      final goToLoginButton = find.descendant(
          of: find.byKey(const ValueKey('registerGoToSignInButton')),
          matching: find.byType(GestureDetector));

      // Verify that
      expect(goToLoginButton, findsOneWidget);
    });

    testWidgets('Google Button Present', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButton = find.descendant(
          of: find.byKey(const ValueKey('loginGoToRegisterButton')),
          matching: find.byType(GestureDetector));
      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();

      final googleButton = find.byKey(const ValueKey('registerGoogleButton'));

      expect(googleButton, findsOneWidget);
    });

    testWidgets('Title widget Present', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButton = find.descendant(
          of: find.byKey(const ValueKey('loginGoToRegisterButton')),
          matching: find.byType(GestureDetector));
      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();

      final title = find.byKey(const ValueKey("registerTitle"));

      expect(title, findsOneWidget);
    });

    testWidgets('Password field modified', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButton = find.descendant(
          of: find.byKey(const ValueKey('loginGoToRegisterButton')),
          matching: find.byType(GestureDetector));
      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();

      final passwordField = find.byKey(const ValueKey("registerPasswordField"));

      await tester.enterText(passwordField, '1234');
      await tester.pumpAndSettle();

      expect(find.text('1234'), findsOneWidget);
    });

    testWidgets('Email field modified', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButton = find.descendant(
          of: find.byKey(const ValueKey('loginGoToRegisterButton')),
          matching: find.byType(GestureDetector));
      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();

      final emailField = find.byKey(const ValueKey("registerEmailField"));

      await tester.enterText(emailField, 'tritri@mail.eu');
      await tester.pumpAndSettle();

      expect(find.text('tritri@mail.eu'), findsOneWidget);
    });

    testWidgets('Firstname field modified', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButton = find.descendant(
          of: find.byKey(const ValueKey('loginGoToRegisterButton')),
          matching: find.byType(GestureDetector));
      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();

      final firstnameField =
          find.byKey(const ValueKey("registerFirstnameField"));

      await tester.enterText(firstnameField, 'John');
      await tester.pumpAndSettle();

      expect(find.text('John'), findsOneWidget);
    });

    testWidgets('Lastname field modified', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp(isUnitTesting: true));
      final goToRegisterButton = find.descendant(
          of: find.byKey(const ValueKey('loginGoToRegisterButton')),
          matching: find.byType(GestureDetector));
      await tester.tap(goToRegisterButton);
      await tester.pumpAndSettle();

      final lastnameField = find.byKey(const ValueKey("registerLastnameField"));

      await tester.enterText(lastnameField, 'Doe');
      await tester.pumpAndSettle();

      expect(find.text('Doe'), findsOneWidget);
    });
  });
}
