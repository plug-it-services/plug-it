
import 'package:mobile/models/Action.dart';
import 'package:mobile/models/Plug.dart';
import 'package:mobile/models/Service.dart';
import 'package:mobile/models/Trigger.dart';

import 'package:dio/dio.dart';


class PlugApi {
  static String? token;
  static String? sessionToken;
  static const String apiUrl = "https://plug-it.com";
  static const String devApiUrl = "https://localhost.com/";
  static var error;

  Future<List<Service>?> getServices() async {
    try {
      var dio = Dio();
      Response<List<Service>> result = await dio.get<List<Service>>("$apiUrl/services");
      return result.data;
    } catch (error) {
      PlugApi.error = error;
      return null;
    }
  }

  String? OAuth2(String serviceName) {

  }

  String? OAuth2Callback(String serviceName) {

  }

  Future<bool> disconnectService(String serviceName) async {
    try {
      var dio = Dio();
      Response result = await dio.post("$apiUrl/service/$serviceName/disconnect");
      return result.statusCode == 200;
    } catch (error) {
      PlugApi.error = error;
      return false;
    }
  }

  Future<List<Trigger>?> getServiceTriggers(String serviceName) async {
    try {
      var dio = Dio();
      Response<List<Trigger>> result = await dio.get<List<Trigger>>("$apiUrl/service/$serviceName/events");
      return result.data;
    } catch (error) {
      PlugApi.error = error;
      return null;
    }
  }

  Future<List<Event>?> getServiceActions(String serviceName) async {
    try {
      var dio = Dio();
      Response<List<Event>> result = await dio.get<List<Event>>("$apiUrl/service/$serviceName/actions");
      return result.data;
    } catch (error) {
      PlugApi.error = error;
      return null;
    }

  }

  String? OAuthApiKey(String serviceName, String apiKey) {

  }

  String? OAuthCredentials(String serviceName, String id, String secret) {

  }

  bool executeWebHook(String serviceName, String webHookId) {
    return false;
  }

  Future<List<Plug>?> getPlugs() async {
    try {
      var dio = Dio();
      Response<List<Plug>> result = await dio.get<List<Plug>>("$apiUrl/plugs");
      return result.data;
    } catch (error) {
      PlugApi.error = error;
      return null;
    }
  }

  bool createPlug(Plug plug) {
    return false;
  }

  Plug getPlug(String id) {
    return Plug();
  }

  bool deletePlug(String id) {
    return false;
  }

  bool editPlug(Plug plug) {
    return false;
  }

  bool enablePlug(Plug plug, bool enabled) {
    return false;
  }

  bool login(String email, String password) {
    return false;
  }

  bool register(String firstName, String lastName, String email, String password) {
    return false;
  }

  bool ssoLogin(String serviceName, String code) {
    return false;
  }





}