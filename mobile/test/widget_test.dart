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
    testWidgets('Fields Present', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp());
      final usernameField = find.byKey(const ValueKey('loginEmailField'));
      final passwordField = find.byKey(const ValueKey('loginPasswordField'));

      final signButtonParent = find.byKey(const ValueKey('loginSignButton'));
      final signButton = find.descendant(
          of: signButtonParent, matching: find.byType(GestureDetector));

      final goToRegisterButtonParent =
          find.byKey(const ValueKey('loginGoToRegisterButton'));
      final goToRegisterButton = find.descendant(
          of: goToRegisterButtonParent, matching: find.byType(GestureDetector));

      final googleButton = find.byKey(const ValueKey('loginGoogleButton'));
      // Verify that
      expect(usernameField, findsOneWidget);
      expect(passwordField, findsOneWidget);
      expect(signButton, findsOneWidget);
      expect(goToRegisterButton, findsOneWidget);
      expect(googleButton, findsOneWidget);
    });

    testWidgets('Password field modified', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp());
      final passwordField = find.byKey(const ValueKey('loginPasswordField'));

      await tester.enterText(passwordField, 'azerA@ty1234');
      await tester.pumpAndSettle();
      expect(find.text('azerA@ty1234'), findsOneWidget);
    });

    testWidgets('Email field modified', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp());
      final usernameField = find.byKey(const ValueKey('loginEmailField'));

      await tester.enterText(usernameField, 'titi@toto.com');
      await tester.pumpAndSettle();
      expect(find.text('titi@toto.com'), findsOneWidget);
    });

    testWidgets('Go to register', (WidgetTester tester) async {
      // Build our app and trigger a frame
      await tester.pumpWidget(const MyApp());

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
      await tester.pumpWidget(const MyApp());
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
      await tester.pumpWidget(const MyApp());
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
}
