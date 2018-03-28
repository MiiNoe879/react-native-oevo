package com.oevo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import ga.piroro.rnt.RNTPackage;
import com.goldenowl.twittersignin.TwitterSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.reactlibrary.RNVideoEditorPackage;
import com.shahenlibrary.RNVideoProcessingPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.wix.pagedcontacts.PagedContactsPackage;
import cl.json.RNSharePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.gettipsi.stripe.StripeReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

import android.support.multidex.MultiDexApplication;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNTPackage(),
            new TwitterSigninPackage(),
            new FBSDKPackage(mCallbackManager),
            new FastImageViewPackage(),
            new ReactNativePushNotificationPackage(),
            new RNFirebasePackage(),
              new RNFirebaseAuthPackage(),
              new RNFirebaseDatabasePackage(),
              new RNFirebaseStoragePackage(),
              new RNFirebaseAdMobPackage(),
              new RNFirebaseFirestorePackage(),
              new RNFirebaseMessagingPackage(),
            new RCTCameraPackage(),
            new RNVideoEditorPackage(),
            new RNVideoProcessingPackage(),
            new RNDeviceInfo(),
            new PagedContactsPackage(),
            new RNSharePackage(),
            new ReactVideoPackage(),
            new RNFetchBlobPackage(),
            new ImagePickerPackage(),
            new StripeReactPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }


  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }


}
